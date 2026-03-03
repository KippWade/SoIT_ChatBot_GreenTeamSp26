/**
 * Conversation Tracker Controller
 * Handles logging and retrieval of chatbot conversations for each user session.
 * @module controllers/conversation_tracker
 */
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/chat_session_logging.json'); // Creates a JSON file to store conversations
const { INTENT } = require('../data/database');

/**
 * Log a conversation message to the session file.
 * @param {string} ticket - Unique session ticket ID.
 * @param {string} userType - Type of user.
 * @param {string} schoolEmail - User's email.
 * @param {string} from - Who sent the message ('user' or 'bot').
 * @param {string} message - The message content.
 * @param {string} intent - The detected intent.
 * @param {Object} opts - Additional options (e.g., locIdx).
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
 * Retrieve a conversation by ticket ID.
 * @param {string} ticket - Unique session ticket ID.
 * @returns {Object|null} The conversation object or null if not found.
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
