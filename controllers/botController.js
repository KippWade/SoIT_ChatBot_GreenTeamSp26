
/**
 * Bot Controller
 *
 * This module manages the main chatbot logic, including:
 *   - Processing user queries and detecting their intent
 *   - Matching user input to known patterns and responses
 *   - Logging conversations and unanswered questions for review
 *   - Handling language detection and response localization
 *
 * Designed for maintainability and extensibility to support future updates and new features.
 *
 * @module controllers/botController
 */
const fs = require('fs');
const path = require('path');
const fuzz = require('fuzzball'); // NPM Package Info https://www.npmjs.com/package/fuzzball
const { responses, locations, INTENT, LANGUAGE, COURSE_PREFIXES, HELPFUL_SUGGESTIONS, HELP_PATTERNS } = require('../data/database'); // Stand-in for external MongoDB instance
const unansweredFilePath = path.join(__dirname, '../data/unanswered_inquiries.json'); // File to store unanswered/unmatched inquiries
const { addConversation, getConversation } = require('./conversation_tracker');
const { buildResponse, isErrorResponse } = require('./replyController'); // Response building functions
const { detectLanguage } = require('./languageController'); // Language detection functions

/**
 * Logs an unanswered or unmatched user question to a JSON file for later review by administrators.
 * This helps improve the chatbot by tracking queries it could not answer.
 *
 * @param {string} question - The user's submitted question (as received).
 * @param {string} userType - The type of user (e.g., 'Student', 'Guest', etc.).
 * @param {string} schoolEmail - The user's school email address, if provided.
 * @param {string|null} [originalQuestion=null] - The original question, if this is a follow-up or rephrased inquiry.
 *
 * @returns {void}
 *
 * @throws Will log an error if the JSON file cannot be parsed, but will not throw to the caller.
 *
 * @sideeffect Writes to the 'unanswered_inquiries.json' file in the data directory.
 */
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

/**
 * Retrieves all unanswered questions previously logged to the JSON file.
 *
 * @returns {Array<Object>} Array of unanswered question objects, each containing question, userType, schoolEmail, date, ticket, and optionally originalQuestion.
 *
 * @sideeffect Reads from the 'unanswered_inquiries.json' file in the data directory.
 */
function getUnansweredQuestions() {
    if (!fs.existsSync(unansweredFilePath)) return [];
    return JSON.parse(fs.readFileSync(unansweredFilePath));
}

/**
 * Attempts to determine which campus/location the user is referring to in their prompt.
 * Uses fuzzy string matching to compare the prompt to known locations.
 *
 * @param {string} prompt - The user's input prompt (should be lowercased for best results).
 * @returns {number} The index of the matched location in the locations array, or -1 if no strong match is found.
 *
 * @sideeffect Logs matching process and results to the console for debugging.
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

/**
 * Extracts a course code from the user's prompt using a regular expression.
 * Course codes are matched based on the pattern defined in the database module.
 *
 * @param {string} prompt - The user's input prompt.
 * @returns {string|null} The matched course code (with spaces/dashes removed), or null if not found.
 */
function getCourseCodeFromPrompt(prompt) {
    const db = require('../data/database');           // Import here (or move to top)
    const match = prompt.match(db.COURSE_CODE_REGEX);
    return match ? match[0].replace(/[\s-]+/g, '') : null;  // Clean spaces/dashes
}

/**
 * Main entry point for processing chatbot queries.
 *
 * Handles the following:
 *   - Receives user prompt and metadata from the Express request
 *   - Detects the user's intent using fuzzy matching and pattern recognition
 *   - Determines the appropriate response, including language localization
 *   - Extracts relevant entities (such as location or course code) from the prompt
 *   - Logs both the user message and the bot's response for conversation history
 *   - Records unanswered questions for future review
 *
 * @function
 * @param {Object} req - Express request object. Expects body fields: prompt (string), userType (string), schoolEmail (string), ticketId (string), language (string).
 * @param {Object} res - Express response object. Responds with JSON: { response: string }.
 *
 * @returns {void}
 *
 * @sideeffect Logs conversation and unanswered questions, writes to conversation and unanswered files.
 */

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

    // Check for course prefix in prompt
    const coursePrefixMatch = COURSE_PREFIXES.find(prefix => {
        // Match prefix as a whole word, case-insensitive
        const regex = new RegExp(`\\b${prefix}\\b`, 'i');
        return regex.test(prompt);
    });

    if (coursePrefixMatch) {
        detectedIntent = INTENT.COURSE_INFO_GENERAL;
        matchedResponse = responses.find(r => r.intent === INTENT.COURSE_INFO_GENERAL);
    }

    console.log(`${new Date().toISOString()} :: USER PROMPT: `, prompt);
    // Establish active language: requested or auto-detected
    let activeLanguage = requestedLanguage || detectLanguage(prompt);

    // Build a flat array of all patterns with their associated intent
    const allPatterns = [];
    for (const resp of responses) {
        const patterns = (activeLanguage === LANGUAGE.FILIPINO)
            ? resp.pattern?.fil || []
            : resp.pattern?.en || [];
        patterns.forEach(p => allPatterns.push({ intent: resp.intent, pattern: p }));
    }

    // Use fuzzball to extract best fuzzy match for user input
    const results = fuzz.extract(prompt, allPatterns, {
        scorer: (input, choice) => fuzz.token_set_ratio(input, choice.pattern),
        processor: choice => choice.pattern,
        limit: 1,
        cutoff: 70,
        force_ascii: true
    });

    if (results.length > 0 && results[0][1] >= 70) {
        detectedIntent = results[0][0].intent;
        matchedResponse = responses.find(r => r.intent === detectedIntent);
        console.log(`${new Date().toISOString()} :: FUZZY MATCHED INTENT: ${detectedIntent}`);
    }

    // Fallback to regex/whole word matching if no fuzzy match found
    if (!matchedResponse) {
        console.log(`${new Date().toISOString()} :: NO FUZZY MATCH, FALLING BACK TO PATTERN MATCHING`);
        for (const resp of responses) {
            const patterns = (activeLanguage === LANGUAGE.FILIPINO)
                ? resp.pattern?.fil || []
                : resp.pattern?.en || [];
            for (const p of patterns) {
                const wordRegex = new RegExp(`\\b${p.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                if (wordRegex.test(prompt)) {
                    matchedResponse = resp;
                    detectedIntent = resp.intent;
                    break;
                }
            }
            if (matchedResponse) break;
        }
    }


    // Use correct language key for help patterns
    const patternsArr = HELP_PATTERNS[activeLanguage === LANGUAGE.FILIPINO ? 'fil' : 'en'] || HELP_PATTERNS.en;
    const matchesHelpPattern = patternsArr.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(prompt);
    });

    console.log(`${new Date().toISOString()} :: MATCHED RESPONSE: ${matchedResponse !== null}`);
    console.log(`${new Date().toISOString()} :: MATCHED RESPONSE TYPE: ${matchedResponse?.type}`);
    console.log(`${new Date().toISOString()} :: MATCHED RESPONSE: ${matchedResponse !== null}`);
    let locIdx = getLocationIndexFromPrompt(prompt);
    if(locIdx < 0 && session && session.entities.campusLocationIdx !== undefined) {
        locIdx = session.entities.campusLocationIdx;
    }

    let courseCode = null;
    if (matchedResponse && matchedResponse.intent === INTENT.COURSE_INFO_GENERAL) {
        courseCode = getCourseCodeFromPrompt(prompt);
    }

    if (!matchedResponse) {
        const suggestionsArr = HELPFUL_SUGGESTIONS[activeLanguage === LANGUAGE.FILIPINO ? 'fil' : 'en'] || HELPFUL_SUGGESTIONS.en;
        if (matchesHelpPattern) {
            // Only show helpful suggestions, no "didn't understand" message
            const { buildHelpfulSuggestionsList } = require('../utils/suggestions');
            response = buildHelpfulSuggestionsList(suggestionsArr, activeLanguage === LANGUAGE.FILIPINO ? 'fil' : 'en');
        } else {
            const { buildHelpfulSuggestionsList } = require('../utils/suggestions');
            response = (activeLanguage === LANGUAGE.FILIPINO)
                ? "Paumanhin, hindi ko naintindihan ang iyong tanong."
                : "Sorry, I didn't understand your question.";
            // Add up to 3 random helpful suggestions as an HTML bullet list
            response += '<br>' + buildHelpfulSuggestionsList(suggestionsArr, activeLanguage === LANGUAGE.FILIPINO ? 'fil' : 'en');
        }
        addUnansweredQuestion(prompt, userType, schoolEmail);
    } else {
        response = buildResponse(matchedResponse, activeLanguage, { locIdx, session, courseCode });
        // Always log unanswered if error statement is used
        if (isErrorResponse(response, activeLanguage)) {
            addUnansweredQuestion(prompt, userType, schoolEmail);
        }
    }

    // Log user message
    let detectedIntentForLogging = matchedResponse ? (detectedIntent || null) : null; // or use 'UNKNOWN' if preferred
    console.log(`${new Date().toISOString()} :: LOGGING USER MESSAGE WITH INTENT: ${detectedIntentForLogging}`);
    addConversation(ticket, userType, schoolEmail, 'user', prompt, detectedIntentForLogging, { locIdx });

    // Log bot response
    addConversation(ticket, userType, schoolEmail, 'bot', response, detectedIntent);
    console.log(`${new Date().toISOString()} :: BOT RESPONSE: `);
    console.log(response);
    res.json({ response });
}

/**
 * Renders the chatbot's home page.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object. Calls res.render with the 'index' view and a title.
 *
 * @returns {void}
 */
module.exports.response = (req, res) => {
    res.render('index', { title: 'Home' });
}
