/**
 * Conversation Tracker Controller
 *
 * This module manages the logging and retrieval of chatbot conversations for each user session.
 * It is responsible for:
 *   - Persisting all user and bot messages for a session
 *   - Tracking current and previous detected intents
 *   - Storing session-specific entities (such as campus location index)
 *
 * The conversation history is stored in a JSON file for later analysis or debugging.
 *
 * @module controllers/conversation_tracker
 */
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/chat_session_logging.json'); // Creates a JSON file to store conversations
const { INTENT } = require('../data/database');

/**
 * Logs a conversation message to the session file, creating a new session if needed.
 *
 * This function will:
 *   - Create a new conversation session if the ticket is not found
 *   - Update the current and previous intent for the session
 *   - Track entities such as campus location index if provided
 *   - Append the message (from user or bot) to the conversation history
 *   - Persist all changes to the JSON file on disk
 *
 * @param {string} ticket - Unique session ticket ID for the conversation.
 * @param {string} userType - Type of user (e.g., 'Student', 'Guest').
 * @param {string} schoolEmail - User's school email address.
 * @param {string} from - Who sent the message ('user' or 'bot').
 * @param {string} message - The message content to log.
 * @param {string} intent - The detected intent for this message (may be null for bot messages).
 * @param {Object} [opts={}] - Additional options (e.g., { locIdx: number }) for entity tracking.
 *
 * @returns {void}
 *
 * @sideeffect Writes to the 'chat_session_logging.json' file in the data directory.
 */
function addConversation(ticket, userType, schoolEmail, from, message, intent, opts = {}) {
    let conversations = [];
    if (fs.existsSync(filePath)) {
        conversations = JSON.parse(fs.readFileSync(filePath));
    }

    let convo = conversations.find(c => c.ticket === ticket);

    const locIdx = opts.locIdx || null;
    console.log('Location index being logged in conversation:', locIdx);
    
    // Create new empty conversation
    if (!convo) {
        convo = {
            ticket,
            userType,
            schoolEmail,
            conversation: [],
            date: new Date().toISOString(),
            currentIntent: intent,
            previousIntent: INTENT.UNKNOWN,
            entities: {}
        };
        conversations.push(convo);
    }
    
    if(from === 'user'){
        // Update current intent if provided
        let tempIntent = convo.currentIntent;
        convo.currentIntent = intent || convo.currentIntent;

        if(tempIntent && tempIntent !== convo.currentIntent) {
            convo.previousIntent = tempIntent;
        }

        if(locIdx !== null && locIdx > -1) {
            convo.entities.campusLocationIdx = locIdx;
        }
    }

    // Build message object
    let msgObj = {
        from,
        message,
        currentIntent: convo.currentIntent
    }

    // Add message
    convo.conversation.push(msgObj);

    // Save file
    fs.writeFileSync(filePath, JSON.stringify(conversations, null, 2));
}

/**
 * Retrieves a conversation session by its unique ticket ID.
 *
 * @param {string} ticket - Unique session ticket ID to look up.
 * @returns {Object|null} The conversation object (with ticket, userType, schoolEmail, conversation, date, currentIntent, previousIntent, entities), or null if not found.
 *
 * @sideeffect Reads from the 'chat_session_logging.json' file in the data directory.
 */
function getConversation(ticket) {
    if (!fs.existsSync(filePath)) return null;
    const conversations = JSON.parse(fs.readFileSync(filePath));
    return conversations.find(c => c.ticket === ticket) || null;
}

module.exports = {
    addConversation,
    getConversation
};
