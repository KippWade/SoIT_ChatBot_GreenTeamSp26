const fs = require('fs');
const path = require('path');
const fuzz = require('fuzzball'); // NPM Package Info https://www.npmjs.com/package/fuzzball
const { responses, locations, INTENT, LANGUAGE } = require('../data/database'); // Stand-in for external MongoDB instance
const unansweredFilePath = path.join(__dirname, '../data/unanswered_inquiries.json'); // File to store unanswered/unmatched inquiries
const { addConversation, getConversation } = require('./conversation_tracker');
const { buildResponse, isErrorResponse } = require('./replyController'); // Response building functions
const { detectLanguage } = require('./languageController'); // Language detection functions

// TODO: Example URL for direct course catalog search https://catalog.ivytech.edu/search_advanced.php?cur_cat_oid=9&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=SDEV120&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1
// TODO: Example URL for course detail page https://catalog.ivytech.edu/preview_course_nopop.php?catoid=9&coid=40333

// Add unanswered question to JSON file
function addUnansweredQuestion(question, userType, schoolEmail, originalQuestion = null) {
    let questions = [];
    if (fs.existsSync(unansweredFilePath)) {
        try {
            questions = JSON.parse(fs.readFileSync(unansweredFilePath));
        } catch (err) {
            console.error('Failed to parse unanswered_inquiries.json, starting fresh:', err);
            questions = [];
        }
    }
    const ticket = '' + Date.now();
    const entry = {
        question,
        userType,
        schoolEmail,
        date: new Date().toISOString(),
        ticket
    };
    if (originalQuestion) {
        entry.originalQuestion = originalQuestion;
    }
    questions.push(entry);
    fs.writeFileSync(unansweredFilePath, JSON.stringify(questions, null, 2));
}

// To store unanswered questions/inquiries in JSON file
function getUnansweredQuestions() {
    if (!fs.existsSync(unansweredFilePath)) return [];
    return JSON.parse(fs.readFileSync(unansweredFilePath));
}

/* 
    Function to get best matching location index from user prompt
    This would determine which campus/location the user is asking about and return its index in the locations array
 */
function getLocationIndexFromPrompt(prompt) {
    console.log(`${new Date().toISOString()} :: GETTING LOCATION`);

    const options = {
        scorer: fuzz.token_set_ratio, // Any function that takes two values and returns a score, default: ratio
        processor: choice => choice.title,  // Takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
        limit: 1, // Max number of top results to return, default: no limit / 0.
        cutoff: 50, // Lowest score to return, default: 0
        force_ascii: true
    };

    var results = fuzz.extract(prompt, locations, options);
    console.log(`${new Date().toISOString()} :: LOOKUP RESULTS: `);
    console.log(results);

    if (results && results.length > 0 && results[0][1] >= 80) {
        console.log("Matched location index:", results[0][2]);
        return results[0][2];
    }
    console.log("Matched location index:", -1);
    return -1;
}

function getCourseCodeFromPrompt(prompt) {
    const courseCodeRegex = /[A-Za-z]{2,4}[- ]?\d{3,4}/; // Mattches upper/lowercase letters (2-4), optional dash/space, followed by 3-4 digits
    const matches = prompt.match(courseCodeRegex);
    if (matches && matches.length > 0) {
        return matches[0].replace(/[\s-]+/g, ''); // Remove any spaces and dashes in the course code
    }
    return null;
}

// Main query processing function
module.exports.query = (req, res) => {
    let prompt = (req.body.prompt || '').toLowerCase();
    const userType = req.body.userType || 'Guest';
    const schoolEmail = req.body.schoolEmail || '';
    const ticket = req.body.ticketId;
    const requestedLanguage = (req.body.language || '').toLowerCase();
    let response = "";
    const session = getConversation(ticket);
    let detectedIntent = null;
    let matchedResponse = null;

    console.log(`${new Date().toISOString()} :: USER PROMPT: `, prompt);
    // Establish active language: requested or auto-detected
    let activeLanguage = requestedLanguage || detectLanguage(prompt);

    // Build intent-to-patterns mapping (all patterns lowercased)
    const intentPatterns = {};
    for (const resp of responses) {
        console.log("Processing response intent", resp.intent);
        console.log("Active language:", activeLanguage);
        if(resp.intent){
            if(!intentPatterns[resp.intent]) intentPatterns[resp.intent] = [];
            if(activeLanguage === LANGUAGE.FILIPINO){
                if(resp.pattern && Array.isArray(resp.pattern.fil)){
                    intentPatterns[resp.intent].push(...resp.pattern.fil.map(p => p.toLowerCase()));
                }
            } else {
                if(resp.pattern && Array.isArray(resp.pattern.en)){
                    intentPatterns[resp.intent].push(...resp.pattern.en.map(p => p.toLowerCase()));
                }
            }
        }
    }

    // Improved intent detection: whole word and fuzzy match
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
        for (const p of patterns) {
            // Whole word regex match
            const wordRegex = new RegExp(`\\b${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
            if (wordRegex.test(prompt)) {
                detectedIntent = intent; // Intent is the category
                break;
            }
            // Fuzzy match for greetings (only for 'greetings' intent)
            // This try to catch casual greetings
            if (intent === INTENT.GREETINGS) {
                const fuzzScore = fuzz.token_set_ratio(prompt, p);
                if (fuzzScore >= 70) {
                    detectedIntent = intent;
                    break;
                }
            }            
        }
    }

    if (detectedIntent) {
        console.log(`${new Date().toISOString()} :: DETECTED INTENT: ${detectedIntent}`);
        matchedResponse = responses.find(r => r.intent === detectedIntent);
    }
    if (!matchedResponse) {
        console.log(`${new Date().toISOString()} :: NO INTENT DETECTED, FALLING BACK TO PATTERN MATCHING`);
        // Fallback to pattern matching if no intent detected
        for (const resp of responses) {
            if (Array.isArray(resp.pattern)) {
                for (const p of resp.pattern) {
                    const wordRegex = new RegExp(`\\b${p.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                    if (wordRegex.test(prompt)) {
                        matchedResponse = resp;
                        break;
                    }
                    // Fuzzy match for greetings and address_info
                    if (resp.intent === INTENT.GREETINGS || resp.intent === INTENT.ADDRESS_INFO) {
                        const fuzzScore = fuzz.token_set_ratio(prompt, p.toLowerCase());
                        if (fuzzScore >= 70) {
                            matchedResponse = resp;
                            break;
                        }
                    }
                    if (matchedResponse) break;
                }
            }
            if (typeof resp.pattern === 'string') {
                const wordRegex = new RegExp(`\\b${resp.pattern.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                if (wordRegex.test(prompt)) {
                    matchedResponse = resp;
                    break;
                }
            }
            if (matchedResponse) break;
        }
    }

    console.log(`${new Date().toISOString()} :: MATCHED RESPONSE: ${matchedResponse !== null}`);
    console.log(`${new Date().toISOString()} :: MATCHED RESPONSE TYPE: ${matchedResponse?.type}`);
    let locIdx = getLocationIndexFromPrompt(prompt);
    if(locIdx < 0 && session && session.entities.campusLocationIdx !== undefined) {
        locIdx = session.entities.campusLocationIdx;
    }
    const courseCode = getCourseCodeFromPrompt(prompt);

    response = buildResponse(matchedResponse, activeLanguage, { locIdx, session, courseCode });

    // Always log unanswered if error statement is used
    if (isErrorResponse(response, activeLanguage)) {
        addUnansweredQuestion(prompt, userType, schoolEmail);
    }
    
    // Log user message
    let detectedIntentForLogging = detectedIntent || (session ? session.currentIntent : null);
    console.log(`${new Date().toISOString()} :: LOGGING USER MESSAGE WITH INTENT: ${detectedIntentForLogging}`);
    addConversation(ticket, userType, schoolEmail, 'user', prompt, detectedIntentForLogging, { locIdx });

    // Log bot response
    addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent);
    console.log(`${new Date().toISOString()} :: BOT RESPONSE: `);
    console.log(response);
    res.json({ response });
}

module.exports.response = (req, res) => {
    res.render('index', { title: 'Home' });
}