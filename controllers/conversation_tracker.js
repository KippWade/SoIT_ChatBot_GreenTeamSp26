const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/chat_session_logging.json'); // Creates a JSON file to store conversations
const { INTENT } = require('../data/database');

// Function to log conversations
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

function getConversation(ticket) {
    if (!fs.existsSync(filePath)) return null;
    const conversations = JSON.parse(fs.readFileSync(filePath));
    return conversations.find(c => c.ticket === ticket) || null;
}

module.exports = {
    addConversation,
    getConversation
};
