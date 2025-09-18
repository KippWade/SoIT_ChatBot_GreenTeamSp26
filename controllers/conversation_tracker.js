const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/chat_session_logging.json'); // Creates a JSON file to store conversations

// Function to log conversations
function addConversation(ticket, userType, schoolEmail, from, message) {
    let conversations = [];
    if (fs.existsSync(filePath)) {
        conversations = JSON.parse(fs.readFileSync(filePath));
    }
    let convo = conversations.find(c => c.ticket === ticket);
    if (convo) {
        // Append to existing conversation
        convo.conversation.push({ from, message });
    } else {
        // Create new conversation
        convo = {
            ticket,
            userType,
            schoolEmail,
            conversation: [{ from, message }],
            date: new Date().toISOString()
        };
        conversations.push(convo);
    }
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
