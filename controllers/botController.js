const fs = require('fs'); 
const path = require('path');
const fuzz = require('fuzzball'); // NPM Package Info https://www.npmjs.com/package/fuzzball
const { responses, locations } = require('../data/database'); // Stand-in for external MongoDB instance
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

// Add unanswered question to JSON file
function addUnansweredQuestion(question, userType, schoolEmail) {
    let questions = [];
    if (fs.existsSync(unansweredFilePath)) {
        questions = JSON.parse(fs.readFileSync(unansweredFilePath));
    }
    const ticket = '' + Date.now();
    questions.push({
        question,
        userType,
        schoolEmail,
        date: new Date().toISOString(),
        ticket
    });
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
    const index = locations.findIndex(location => location.title.toLowerCase() === prompt.toLowerCase());
    console.log("Matched location index:", index);
    if (index > -1) {
        console.log("Matched location title:", locations[index].title);
    }

      options = {
        scorer: fuzz.token_set_ratio, // Any function that takes two values and returns a score, default: ratio
        processor: choice => choice.title,  // Takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
        limit: 1, // Max number of top results to return, default: no limit / 0.
        cutoff: 50, // Lowest score to return, default: 0
        force_ascii: true
    };

    var results = fuzz.extract(prompt, locations, options);
    console.log(`${new Date().toISOString()} :: LOOKUP RESULTS: `);
    console.log(results);

    if (results && results.length > 0 && results[0][1] >= 80 && results[0][2] != null) {
        return results[0][2];
    }
    return -1;
}

<<<<<<< Updated upstream
=======
function buildWhitePagesURL(firstName, lastName, location, role, title) 
{
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}

// Language router - detects user's language and delegates to appropriate handler
function detectLanguageAndHandle(originalPrompt, req, res, options) {
    const { ticket, userType, schoolEmail, suffix, responses, locations, getLocationIndexFromPrompt, addConversation, errorStatements } = options;
    
    // Check for Filipino
    if (isFilipino(originalPrompt)) {
        return handleFilipinoLanguage(originalPrompt, req, res, options);
    }
    
    // Add other language checks here (e.g., Spanish, Vietnamese, etc.)
    // if (isSpanish(originalPrompt)) {
    //     return handleSpanishLanguage(originalPrompt, req, res, options);
    // }
    
    // Default: English (return null to continue with normal flow)
    return null;
}

// Handle Filipino language processing
function handleFilipinoLanguage(originalPrompt, req, res, options) {
    const { ticket, userType, schoolEmail, suffix, responses, getLocationIndexFromPrompt, addConversation, errorStatements } = options;
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
    
    // Log user message
    addConversation(ticket, userType, schoolEmail, 'user', translatedPrompt, detectedIntent, originalPrompt, true, null);
    
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
        
        addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent, originalPrompt, true, botFilipinoResponse);
        console.log(`${new Date().toISOString()} :: BOT RESPONSE: `, response);
        return res.json({response});
    } else {
        // Fallback error response
        const n = Math.floor(Math.random() * 3);
        const response = errorStatements[n];
        addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent, originalPrompt, true, response);
        console.log(`${new Date().toISOString()} :: BOT RESPONSE: `, response);
        return res.json({response});
    }
}

>>>>>>> Stashed changes


// Main query processing function
module.exports.query = (req, res) => {
    const n = Math.floor(Math.random() * 3);
    let prompt = (req.body.prompt || '').toLowerCase();
    const userType = req.body.userType || 'Guest';
    const schoolEmail = req.body.schoolEmail || '';
    const ticket = req.body.ticketId;
    let response = "";
    const suffix = "&nbsp;<i class='bx bx-link-external'></i></a>"; // External link icon
    const session = getConversation(ticket);
    let detectedIntent = null;
    let matchedResponse = null;

    // Language detection and handling
    const languageResult = detectLanguageAndHandle(req.body.prompt, req, res, {
        ticket, userType, schoolEmail, suffix, responses, locations, 
        getLocationIndexFromPrompt, addConversation, errorStatements
    });
    
    // If language handler processed the request, return early
    if (languageResult !== null) {
        return; // Response already sent by language handler
    }

    console.log(`${new Date().toISOString()} :: USER PROMPT: `, prompt);

    // Track user message in file-based JSON for non-language-specific prompts
    let detectedIntentForLogging = null;
    const intentPatternsForLogging = {};
    for (const resp of responses) {
        if (resp.intent) {
            if (!intentPatternsForLogging[resp.intent]) intentPatternsForLogging[resp.intent] = [];
            if (Array.isArray(resp.pattern)) {
                intentPatternsForLogging[resp.intent].push(...resp.pattern.map(p => p.toLowerCase()));
            } else if (typeof resp.pattern === 'string') {
                intentPatternsForLogging[resp.intent].push(resp.pattern.toLowerCase());
            }
        }
    }
    for (const [intent, patterns] of Object.entries(intentPatternsForLogging)) {
        for (const p of patterns) {
            const wordRegex = new RegExp(`\\b${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
            if (wordRegex.test(prompt)) {
                detectedIntentForLogging = intent;
                break;
            }
            if (intent === 'greetings') {
                const fuzzScore = fuzz.token_set_ratio(prompt, p);
                if (fuzzScore >= 70) {
                    detectedIntentForLogging = intent;
                    break;
                }
            }
        }
        if (detectedIntentForLogging) break;
    }
    addConversation(ticket, userType, schoolEmail, 'user', prompt, detectedIntentForLogging, null, false, null);

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
            if (intent === 'greetings') {
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
                    // Fuzzy match for greetings
                    if (resp.intent === 'greetings') {
                        const fuzzScore = fuzz.token_set_ratio(prompt, p.toLowerCase());
                        if (fuzzScore >= 80) {
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

    if(matchedResponse) {
        switch(matchedResponse.intent){
            case 'address_info':
                if (locIndex > -1) {
                    console.log("Matched location title:", locations[locIndex].title);
                    response = `<strong>${locations[locIndex].title} Campus:</strong><br>`;
                    response += locations[locIndex].address;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page`;
                    response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[locIndex].position.lat},${locations[locIndex].position.lng}' target='_blank'>Google Maps`;
                } else {
                    response = "Which campus are you asking about?"
                }
                break;
            case 'phone_number_info':
                if(locIndex > -1) {
                    response = `<strong>${locations[locIndex].title} Contact Info:</strong><br><br>`;
                    response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIndex].phone}'>${locations[locIndex].phone}</a><br>`;
                    response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIndex].email}">${locations[locIndex].email}</a>`;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page${suffix}`;
                } else {
                    response = "Which campus are you talking about? Or would you like the 24 hour toll free number?";
                }
                break;
            case 'dean_info':
                if(locIndex > -1 && locations[locIndex]?.dean) {
                    response = `<strong>${locations[locIndex].dean.reply}</strong><br>`;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].dean.url}' target='_blank'>Campus Page${suffix}`;
                } else if(locIndex > -1) {
                    response = "Currently, there is no designated Dean for Information Technology at this campus. Please contact the campus administration for more information.";
                }
                else {
                    response = "Which campus are you asking about?"
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
        switch(session.currentIntent){
            case 'address_info':
                if (locIndex > -1) {
                    console.log("Matched location title:", locations[locIndex].title);
                    response = `<strong>${locations[locIndex].title} Campus:</strong><br>`;
                    response += locations[locIndex].address;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page`;
                    response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[locIndex].position.lat},${locations[locIndex].position.lng}' target='_blank'>Google Maps`;
                } else {
                    response = "I can look that up for you. Which campus do you want the address of?"
                }
                break;
            case 'phone_number_info':
                if(locIndex > -1) {
                    response = `<strong>${locations[locIndex].title} Contact Info:</strong><br><br>`;
                    response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIndex].phone}'>${locations[locIndex].phone}</a><br>`;
                    response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIndex].email}">${locations[locIndex].email}</a>`;
                    response += `<br><br><a href='https://www.ivytech.edu/${locations[locIndex].url}' target='_blank'>Campus Page${suffix}`;
                } else {
                    response = "I can look that up for you. Which campus do you want the phone number of?";
                }
                break;
            case 'dean_info':
                if(locIndex > -1 && locations[locIndex]?.dean) {
                    let deanReply = locations[locIndex].dean.reply;
                    let nameMatch = deanReply.match(/is ([^.]+)\./i);
                    let deanName = nameMatch ? nameMatch[1].trim() : '';
                    let deanEmailMatch = deanReply.match(/Email: ([^,\s]+)/i);
                    let deanEmail = deanEmailMatch ? deanEmailMatch[1].trim() : '';
                    let deanPhoneMatch = deanReply.match(/Phone: ([^,\s]+)/i);
                    let deanPhone = deanPhoneMatch ? deanPhoneMatch[1].trim() : '';
                    // Get main info (before Email:)
                    let mainInfo = deanReply.split('Email:')[0].replace(/Phone:.*/, '').trim();
                    // Bold dean name if found
                    if (nameMatch && deanName) {
                        mainInfo = mainInfo.replace(deanName, `<strong>${deanName}</strong>`);
                    }
                    response = mainInfo;
                    if (deanEmail) {
                        response += `<br><br>Email: <a href='mailto:${deanEmail}'>${deanEmail}</a>`;
                    }
                    if (deanPhone) {
                        response += `<br>Phone: <a href='tel:${deanPhone}'>${deanPhone}</a>`;
                    }
                    response += `<br><br><a href='${locations[locIndex].dean.url}' target='_blank'>Dean's Page${suffix}`;
                } else if(locIndex > -1) {
                    response = "Currently, there is no designated Dean for Information Technology at this campus. Please contact the campus administration for more information.";
                }
                else {
                    response = "Which campus are you asking about?"
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
    addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent);
    console.log(`${new Date().toISOString()} :: BOT RESPONSE: `);
    console.log(response);
    res.json({response});
}  

module.exports.response = (req, res) => {
    res.render('index', {title: 'Home'});    
}
