// Always reset ticket/session on page load
window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('ticketId');
    localStorage.removeItem('sessionTimestamp');
});

const form = document.getElementById('chatForm');
const userTypeSelect = document.getElementById('userType');
const userTypeSection = document.getElementById('userTypeSection');
const userTypeNext = document.getElementById('userTypeNext');
const emailSection = document.getElementById('emailSection');
const emailNext = document.getElementById('emailNext');
const schoolEmailInput = document.getElementById('schoolEmail');
const questionSection = document.getElementById('questionSection');

let userType = '';
let schoolEmail = '';
let inactivityTimer;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes limit on inactivity

// Function to reset inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const chatBody = document.getElementById('chat-body');
        const botResponse = document.createElement('div');
        botResponse.classList.add('message', 'bot');
        botResponse.innerHTML = "<div class='avatar'><img src='img/ivybot_face.png'></div><div class='content'>Are you still there? If you need more help, just ask!</div>";
        chatBody.appendChild(botResponse);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, INACTIVITY_LIMIT);
}


userTypeNext.addEventListener('click', function() {
    userType = userTypeSelect.value;
    if (!userType) {
        alert('Please select your user type.');
        return;
    }
    userTypeSection.style.display = 'none';
    if (userType === 'Student' || userType === 'Faculty') {
        emailSection.style.display = 'block';
    } else {
        // Only generate ticketId if not already set
        if (!localStorage.getItem('ticketId')) {
            localStorage.setItem('ticketId', generateTicketId(userType, ''));
        }
        questionSection.style.display = 'block';
    }
});


emailNext.addEventListener('click', function() {
    schoolEmail = schoolEmailInput.value;
    if (!schoolEmailInput.checkValidity()) {
        alert('Please enter a valid school email.');
        return;
    }
    // Only generate ticketId if not already set
    if (!localStorage.getItem('ticketId')) {
        localStorage.setItem('ticketId', generateTicketId(userType, schoolEmail));
    }
    emailSection.style.display = 'none';
    questionSection.style.display = 'block';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //create user query message
    const chatBody = document.getElementById('chat-body'); 
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    const userMessageContent = document.createElement('div');
    userMessageContent.classList.add('content');
    userMessageContent.textContent = form.prompt.value;
    userMessage.appendChild(userMessageContent);
    chatBody.appendChild(userMessage);

    // get the values
    const prompt = form.prompt.value;

    //reset form input
    form.prompt.value = '';

    //try to send the user prompt via POST
    const ticketId = localStorage.getItem('ticketId');
    try {
        const res = await fetch('/ivybot', {
            method: 'POST',              
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt, userType, schoolEmail, ticketId })
        });

        const data = await res.json();

        //generate bot response div
        const botResponse = document.createElement('div');
        botResponse.classList.add('message', 'bot');

        const botMessageAvatar = document.createElement('div');
        botMessageAvatar.classList.add('avatar');
        botMessageAvatar.innerHTML = '<img src="img/ivybot_face.png">';

        const botMessageContent = document.createElement('div');                
        botMessageContent.classList.add('content');
        botMessageContent.innerHTML = data.response;

        botResponse.appendChild(botMessageAvatar);
        botResponse.appendChild(botMessageContent);
        chatBody.appendChild(botResponse);
    }
    catch (err) {
        console.log(err);
    }

    //update the view by scrolling to the bottom of the conversation
    chatBody.scrollTop = chatBody.scrollHeight;
    resetInactivityTimer();
});

// Start inactivity timer on page load
resetInactivityTimer();


function generateTicketId(userType, schoolEmail) {
    // Use a persistent timestamp for the session
    let sessionTimestamp = localStorage.getItem('sessionTimestamp');
    if (!sessionTimestamp) {
        sessionTimestamp = Date.now();
        localStorage.setItem('sessionTimestamp', sessionTimestamp);
    }
    return userType + '-' + schoolEmail + '-' + sessionTimestamp;
}
