const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/chat_session_logging.json'); // Creates a JSON file to store conversations

// Function to log conversations
function addConversation(ticket, userType, schoolEmail, from, message, intent, originalPrompt, isFilipino, botFilipinoResponse) {
    let conversations = [];
    if (fs.existsSync(filePath)) {
        conversations = JSON.parse(fs.readFileSync(filePath));
    }
    let convo = conversations.find(c => c.ticket === ticket);
    if (convo) {
        // Append to existing conversation
        if(intent)
            convo.currentIntent = intent; // Update intent if provided
        convo.conversation.push({ from, message });
    } else {
        // Create new conversation
        convo = {
            ticket,
            userType,
            schoolEmail,
            conversation: [{ from, message }],
            date: new Date().toISOString(),
            currentIntent: intent
        };
        conversations.push(convo);
    }

    // Always update currentIntent for every message
    convo.currentIntent = intent;

    // Add the user message to the conversation
    if (from === 'user') {
        if (isFilipino && originalPrompt) {
            convo.conversation.push({
                from,
                message: `Original: ${originalPrompt} | Translated: ${message}`,
                isFilipino,
                currentIntent: convo.currentIntent
            });
        } else {
            convo.conversation.push({ from, message, currentIntent: convo.currentIntent });
        }
    }

    // Add the bot response to the conversation
    if (from === 'bot') {
        if (isFilipino && botFilipinoResponse) {
            convo.conversation.push({
                from,
                message: `Original: ${botFilipinoResponse} | Translated: ${message}`,
                isFilipino,
                currentIntent: convo.currentIntent
            });
        } else {
            convo.conversation.push({ from, message, currentIntent: convo.currentIntent });
        }
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
