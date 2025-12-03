const fs = require('fs');
const path = require('path');
const fuzz = require('fuzzball'); // NPM Package Info https://www.npmjs.com/package/fuzzball
const { responses, locations, INTENT } = require('../data/database'); // Stand-in for external MongoDB instance
const unansweredFilePath = path.join(__dirname, '../data/unanswered_inquiries.json'); // File to store unanswered/unmatched inquiries
const { addConversation, getConversation } = require('./conversation_tracker');
const { isFilipino, translateFilipinoToEnglish, handleFilipinoReply } = require('./filipino_translation'); // File for Filipino translation functions


// TODO: Example URL for direct course catalog search https://catalog.ivytech.edu/search_advanced.php?cur_cat_oid=9&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=SDEV120&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1
// TODO: Example URL for course detail page https://catalog.ivytech.edu/preview_course_nopop.php?catoid=9&coid=40333

// Generic misunderstanding responses
const errorStatements = [
    "Sorry, I didn't quite catch that. Could you try asking in a different way?",
    "I'm having trouble understanding. Would you mind rephrasing your question?",
    "I'm a bit confused by that one. Can you ask it another way, please?"
];

// Filipino error statements
const filipinoErrorStatements = [
    "Pasensya na, medyo hindi ko po gaanong naintindihan ang tanong. Maaari po ba ninyong ipaliwanag o itanong muli sa ibang paraan?",
    "Pasensya na, nahirapan po akong maintindihan ang tanong. Maaari po ba ninyong ulitin o linawin nang kaunti?",
    "Medyo nalito po ako sa tanong ninyo. Maaari po ba ninyong ipaliwanag ito sa ibang paraan?"
];

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

function buildWhitePagesURL(firstName, lastName, location, role, title) {
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}


function buildWhitePagesURL(firstName, lastName, location, role, title) {
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}

// Language router - detects user's language and delegates to appropriate handler
function detectLanguageAndHandle(originalPrompt, req, res, options) {
    const { ticket, userType, schoolEmail, suffix, responses, locations, getLocationIndexFromPrompt, addConversation, errorStatements } = options;

    // Check for Filipino
    if (isFilipino(originalPrompt)) {
        return handleFilipinoLanguage(originalPrompt, req, res, options);
    }
    /*
        Add other language checks here (e.g., Spanish, Vietnamese, etc.)
        if (isSpanish(originalPrompt)) {
            return handleSpanishLanguage(originalPrompt, req, res, options);
        }
        
        Default: English (return null to continue with normal flow)
    */
    return null;
}

// Handle Filipino language processing
function handleFilipinoLanguage(originalPrompt, req, res, options) {
    const { ticket, userType, schoolEmail, suffix, responses, getLocationIndexFromPrompt, addConversation, errorStatements, filipinoErrorStatements } = options;
    const filipinoMode = (req.body.filipinoMode || 'replace').toLowerCase();

    console.log(`${new Date().toISOString()} :: DETECTED FILIPINO PROMPT: `, originalPrompt);

    // Translate and get location indices
    const translatedPrompt = translateFilipinoToEnglish(originalPrompt);
    console.log(`${new Date().toISOString()} :: TRANSLATED PROMPT: `, translatedPrompt);

    const deanLocIndex = getLocationIndexFromPrompt(originalPrompt);
    const originalLocIndex = getLocationIndexFromPrompt(originalPrompt);

    // Intent detection for translated prompt
    let detectedIntent = null;
    const intentPatterns = {};
    for (const resp of responses) {
        if (resp.intent) {
            if (!intentPatterns[resp.intent]) intentPatterns[resp.intent] = [];
            if (Array.isArray(resp.pattern)) {
                intentPatterns[resp.intent].push(...resp.pattern.map(p => p.toLowerCase()));
            } else if (typeof resp.pattern === 'string') {
                intentPatterns[resp.intent].push(resp.pattern.toLowerCase());
            }
        }
    }

    // Detect intent using translated prompt
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
        for (const p of patterns) {
            const wordRegex = new RegExp(`\\b${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
            if (wordRegex.test(translatedPrompt.toLowerCase())) {
                detectedIntent = intent;
                break;
            }
            if (intent === 'greetings') {
                const fuzzScore = require('fuzzball').token_set_ratio(translatedPrompt.toLowerCase(), p);
                if (fuzzScore >= 70) {
                    detectedIntent = intent;
                    break;
                }
            }
        }
        if (detectedIntent) break;
    }
    
    // Find matched response
    let matchedResponse = responses.find(r => {
        const patterns = Array.isArray(r.pattern) ? r.pattern : [r.pattern];
        return patterns.some(p => p.toLowerCase() === translatedPrompt.toLowerCase());
    });

    // If no match with translated prompt, try original prompt
    if (!matchedResponse) {
        matchedResponse = responses.find(r => {
            const patterns = Array.isArray(r.pattern) ? r.pattern : [r.pattern];
            return patterns.some(p => p.toLowerCase() === originalPrompt.toLowerCase());
        });
    }

    if (matchedResponse) {
        // Use Filipino handler for response building
        const { response, botFilipinoResponse } = handleFilipinoReply(
            matchedResponse,
            filipinoMode,
            detectedIntent,
            { originalLocIndex, deanLocIndex, suffix }
        );
        
        console.log(`${new Date().toISOString()} :: BOT RESPONSE: `, response);
        return res.json({ response });

    } else {
        // Fallback error response in Filipino
        const n = Math.floor(Math.random() * 3);
        const response = filipinoErrorStatements[n];
         // Persist unanswered Filipino prompt so staff can review later
        try {
            // Log the translated English prompt for staff readability, but keep the original Filipino text as well
            addUnansweredQuestion(translatedPrompt, userType, schoolEmail, originalPrompt);
        } catch (err) {
            console.error('Failed to write unanswered Filipino prompt:', err);
        }
		console.log(`${new Date().toISOString()} :: BOT RESPONSE: `, response);
        return res.json({ response });
    }
}


// Main query processing function
module.exports.query = (req, res) => {
    const n = Math.floor(Math.random() * 3);
    let prompt = (req.body.prompt || '').toLowerCase();
    const userType = req.body.userType || 'Guest';
    const schoolEmail = req.body.schoolEmail || '';
    const ticket = req.body.ticketId;
    const requestedLanguage = (req.body.language || '').toLowerCase();
    let response = "";
    const suffix = "&nbsp;<i class='bx bx-link-external'></i></a>"; // External link icon
    const session = getConversation(ticket);
    let detectedIntent = null;
    let matchedResponse = null;

    // If the client explicitly requested a language, respect it first
    if (requestedLanguage === 'filipino') {
        const languageOptions = { ticket, userType, schoolEmail, suffix, responses, locations, getLocationIndexFromPrompt, addConversation, errorStatements, filipinoErrorStatements };
        // handleFilipinoLanguage will send the response directly
        return handleFilipinoLanguage(req.body.prompt, req, res, languageOptions);
    }

    // If English is explicitly requested, skip Filipino auto-detection and use English handler
    if (requestedLanguage === 'english') {
        // Continue to English processing below (do NOT call detectLanguageAndHandle)
    } else {
        // Language detection and handling (auto-detect only when no explicit language requested)
        const languageResult = detectLanguageAndHandle(req.body.prompt, req, res, {
            ticket, userType, schoolEmail, suffix, responses, locations,
            getLocationIndexFromPrompt, addConversation, errorStatements, filipinoErrorStatements
        });

        // If language handler processed the request, return early
        if (languageResult !== null) {
            return; // Response already sent by language handler
        }
    }

    console.log(`${new Date().toISOString()} :: USER PROMPT: `, prompt);

    // Build intent-to-patterns mapping (all patterns lowercased)
    const intentPatterns = {};
    for (const resp of responses) {
        console.log("Processing response intent:", resp.intent);
        if (resp.intent) {
            if (!intentPatterns[resp.intent]) intentPatterns[resp.intent] = [];
            if (Array.isArray(resp.pattern)) {
                intentPatterns[resp.intent].push(...resp.pattern.map(p => p.toLowerCase()));
            } else if (typeof resp.pattern === 'string') {
                intentPatterns[resp.intent].push(resp.pattern.toLowerCase());
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
        if (detectedIntent) break;
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
    const locIndex = getLocationIndexFromPrompt(prompt);

    if (matchedResponse) {
        console.log(`${new Date().toISOString()} :: PROCESSING MATCHED RESPONSE FOR INTENT: ${matchedResponse.intent}`);
        switch(matchedResponse.intent){
            case INTENT.ADDRESS_INFO:
                if (locIndex > -1) {
                    console.log("Matched location title:", locations[locIndex].title);
                    response = `<strong>${locations[locIndex].title} Campus Location:</strong><br>`;
                    response += locations[locIndex].address;
                    response += `<br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page</a>`;
                    response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[locIndex].position.lat},${locations[locIndex].position.lng}' target='_blank'>Google Maps</a>`;
                } else {
                    response = "I can look that up for you. Which campus do you want the address of?";
                }
                break;
            case INTENT.PHONE_NUMBER_INFO:
                if (locIndex > -1) {
                    response = `<strong>${locations[locIndex].title} Campus Contact Info:</strong><br><br>`;
                    response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIndex].phone}'>${locations[locIndex].phone}</a><br>`;
                    response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIndex].email}">${locations[locIndex].email}</a>`;
                    response += `<br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page${suffix}`;
                } else {
                    response = "Which campus are you talking about? Or would you like the 24 hour toll free number?";
                }
                break;
            case INTENT.DEAN_INFO:
                if (locIndex > -1) {
                    response = `<strong>${matchedResponse.reply}</strong><br>`;
                    response += `<br><a href='${buildWhitePagesURL('', '', locations[locIndex].title, 'faculty', 'Dean')}' target='_blank'>White Page${suffix}`;
                } else {
                    response = 'Hmm.. which campus are you wanting dean information for? You can also follow this link to search the White Pages for the dean: ';
                    response += '<a href="' + buildWhitePagesURL('', '', '', 'faculty', 'Dean') + '" target="_blank">White Pages</a>';
                }
                break;
            default:
                response = matchedResponse.reply;
                if (matchedResponse.url) {
                    response += `<br><br><a href='${matchedResponse.url}' target='_blank'>${matchedResponse.link}${suffix}`;
                }
                break;
        }
    }
    else if(session) {
        console.log(`${new Date().toISOString()} :: NO MATCHED RESPONSE, USING SESSION INTENT: ${session.currentIntent}`);
        switch(session.currentIntent){
            case INTENT.ADDRESS_INFO:
                if (locIndex > -1) {
                    console.log("Matched location title:", locations[locIndex].title);
                    response = `<strong>${locations[locIndex].title} Campus:</strong><br>`;
                    response += locations[locIndex].address;
                    response += `<br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page</a>`;
                    response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[locIndex].position.lat},${locations[locIndex].position.lng}' target='_blank'>Google Maps</a>`;
                } else {
                    response = "I can look that up for you. Which campus do you want the address of?";
                }
                break;
            case INTENT.PHONE_NUMBER_INFO:
                if (locIndex > -1) {
                    response = `<strong>${locations[locIndex].title} Campus Contact Info:</strong><br><br>`;
                    response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIndex].phone}'>${locations[locIndex].phone}</a><br>`;
                    response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIndex].email}">${locations[locIndex].email}</a>`;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page${suffix}`;
                } else {
                    response = "I can look that up for you. Which campus do you want the phone number of?";
                }
                break;
            case INTENT.DEAN_INFO:
                if (locIndex > -1) {
                    response = `<strong>I can help you find information about the dean!</strong><br>`;
                    response += `<br><a href='${buildWhitePagesURL('', '', locations[locIndex].title, 'faculty', 'Dean')}' target='_blank'>White Page${suffix}</a>`;
                }
                else {
                    response = 'Hmm.. which campus are you wanting dean information for? You can also follow this link to search the White Pages for the dean: ';
                    response += '<br><a href="' + buildWhitePagesURL('', '', '', 'faculty', 'Dean') + '" target="_blank">White Pages</a>';
                }
                break;
            default:
                response = errorStatements[n];
                break;
        }
    }
    else {
        response = errorStatements[n];
    }

    // Always log unanswered if error statement is used
    if (errorStatements.includes(response)) {
        addUnansweredQuestion(prompt, userType, schoolEmail);
    }
    
    // Log user message
    let detectedIntentForLogging = detectedIntent || (session ? session.currentIntent : null);
    console.log(`${new Date().toISOString()} :: LOGGING USER MESSAGE WITH INTENT: ${detectedIntentForLogging}`);
    addConversation(ticket, userType, schoolEmail, 'user', prompt, detectedIntentForLogging);

    // Log bot response
    addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent);
    console.log(`${new Date().toISOString()} :: BOT RESPONSE: `);
    console.log(response);
    res.json({ response });
}

module.exports.response = (req, res) => {
    res.render('index', { title: 'Home' });
}