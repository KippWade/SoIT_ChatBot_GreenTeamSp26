const fs = require('fs'); 
const path = require('path');
const fuzz = require('fuzzball'); // NPM Package Info https://www.npmjs.com/package/fuzzball
const { responses, locations } = require('../data/database'); // Stand-in for external MongoDB instance
const unansweredFilePath = path.join(__dirname, '../data/unanswered_inquiries.json'); // File to store unanswered/unmatched inquiries
const { addConversation } = require('./conversation_tracker'); // 



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
    const index = getLocationIndexFromPrompt(prompt);
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



// Main query processing function
module.exports.query = (req, res) => {
    const n = Math.floor(Math.random() * 3);
    const prompt = (req.body.prompt || '').toLowerCase();
    const userType = req.body.userType || 'Guest';
    const schoolEmail = req.body.schoolEmail || '';
    const ticket = req.body.ticketId;
    let response = "";
    const suffix = "&nbsp;<i class='bx bx-link-external'></i></a>"; // External link icon
    
    // Track user message in file-based JSON
    addConversation(ticket, userType, schoolEmail, 'user', prompt);

    // Build intent-to-patterns mapping (all patterns lowercased)
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
    // Improved intent detection: whole word and fuzzy match
    let detectedIntent = null;
    let matchedResponse = null;
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
        matchedResponse = responses.find(r => r.intent === detectedIntent);
    }
    if (!matchedResponse) {
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
    // Special logic for address/phone lookups
    if (matchedResponse && (matchedResponse.type === 'ADDRESS_LOOKUP' || (matchedResponse.intent && matchedResponse.intent.startsWith('address_info_')))) {
        const index = getLocationIndexFromPrompt(prompt);
        console.log("Matched location index:", index);
        if (index > -1) {
            console.log("Matched location title:", locations[index].title);
            response = `<strong>${locations[index].title} Campus:</strong><br>`;
            response += locations[index].address;
            response += `<br><br><a href='https://www.ivytech.edu/${locations[index].url}' target='_blank'>Campus Page`;
            response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[index].position.lat},${locations[index].position.lng}' target='_blank'>Google Maps`;
        } else {
            response = errorStatements[n];
        }
    } else if (matchedResponse && matchedResponse.type === 'PHONE_LOOKUP') {
        const index = getLocationIndexFromPrompt(prompt);
        if(index > -1) {
            response = `<strong>${locations[index].title} Contact Info:</strong><br>`;
            response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[index].phone}'>${locations[index].phone}</a><br>`;
            response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[index].email}">${locations[index].email}</a>`;
            response += `<br><br><a href='https://www.ivytech.edu/${locations[index].url}' target='_blank'>Campus Page${suffix}`;
        } else {
            response = errorStatements[n];
        }
    } else if (matchedResponse) {
        response = matchedResponse.reply;
        if (matchedResponse.url) {
            response += `<br><br><a href='${matchedResponse.url}' target='_blank'>${matchedResponse.link}${suffix}`;
        }
    } else {
        response = errorStatements[n];
        addUnansweredQuestion(prompt, userType, schoolEmail);
    }
    // Always log unanswered if error statement is used
    if (errorStatements.includes(response)) {
        addUnansweredQuestion(prompt, userType, schoolEmail);
    }
    addConversation(ticket, userType, schoolEmail, 'bot', response);
    console.log(`${new Date().toISOString()} :: BOT RESPONSE: `);
    console.log(response);
    res.json({response});
}  

module.exports.response = (req, res) => {
    res.render('index', {title: 'Home'});    
}
