/**
 * Chatbot Client Script
 *
 * This script manages the client-side logic for the chatbot interface, including:
 *   - UI state transitions and user input handling
 *   - Session and ticket management using localStorage
 *   - Language selection and reconfirmation logic
 *   - Inactivity and language confirmation timers
 *   - AJAX requests to the server for chatbot responses
 *
 * Designed for maintainability and extensibility to support future UI or logic updates.
 *
 * @module public/scripts/chatbot
 */

/*
 * On page load, clear ticketId and sessionTimestamp to ensure a fresh session on every refresh.
 * This guarantees that each page reload starts a new chatbot session and resets language/userType selection.
 * Language selection persists only for the current session unless the timer expires or the page is refreshed.
 */
window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('ticketId');
    localStorage.removeItem('sessionTimestamp');
    // Also clear per-ticket stored language/userType so they reset on refresh
    const currentTicket = localStorage.getItem('ticketId');
    if (currentTicket) {
        localStorage.removeItem('language_for_' + currentTicket);
        localStorage.removeItem('userType_for_' + currentTicket);
    }
    // Show only the language section on page load
    const languageSection = document.getElementById('languageSection');
    const userTypeSection = document.getElementById('userTypeSection');
    if (languageSection) languageSection.style.display = '';
    if (userTypeSection) userTypeSection.style.display = 'none';
});

const form = document.getElementById('chatForm');
const userTypeSelect = document.getElementById('userType');
const userTypeDropdownBtn = document.getElementById('userTypeDropdownBtn');
const usertypeChoices = document.querySelectorAll('.usertype-choice');
const userTypeSection = document.getElementById('userTypeSection');
const userTypeNext = document.getElementById('userTypeNext');
const emailSection = document.getElementById('emailSection');
const emailNext = document.getElementById('emailNext');
const schoolEmailInput = document.getElementById('schoolEmail');
const questionSection = document.getElementById('questionSection');
const emailBack = document.getElementById('emailBack');
const questionBack = document.getElementById('questionBack');

let userType = '';
let schoolEmail = '';
let inactivityTimer;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes limit on inactivity

// Language selection with Modal Reconfirmation
const languageInput = document.getElementById('language');
const languageDropdownBtn = document.getElementById('languageDropdownBtn');
const languageChoices = document.querySelectorAll('.language-choice');
const languageNext = document.getElementById('languageNext');
let language = '';
const LANGUAGE_CONFIRM_DELAY = 3 * 60 * 1000; // 3 minutes before re-confirming language
let languageConfirmTimer;
let pendingLanguage = null; // language chosen but awaiting confirmation
let isChangingLanguage = false; // Flag to track if user is in "change language" flow

/**
 * Focuses the currently visible user type control (dropdown button or select input).
 *
 * @returns {void}
 */
function focusUserTypeControl() {
    if (userTypeDropdownBtn) userTypeDropdownBtn.focus();
    else if (userTypeSelect) userTypeSelect.focus();
}

/**
 * Controls the inactivity timer for the chatbot session.
 * Usage: userActivityTimer('start') to start, userActivityTimer('stop') to stop/clear.
 * If the user is inactive for the defined limit, a bot message prompts for activity.
 *
 * @param {string} action - 'start' to start the timer, 'stop' to clear it.
 * @returns {void}
 */
function userActivityTimer(action) {
    clearTimeout(inactivityTimer);
    if (action === 'stop') return;
    inactivityTimer = setTimeout(() => {
        const chatBody = document.getElementById('chat-body');
        const botResponse = document.createElement('div');
        botResponse.classList.add('message', 'bot');
        const t = getCurrentTranslation();
        // Determine language code for suggestions
        let langCode = (language && language.toLowerCase().startsWith('fil')) ? 'fil' : 'en';
        const suggestionsArr = HELPFUL_SUGGESTIONS[langCode] || HELPFUL_SUGGESTIONS.en;
        const suggestionsHtml = buildHelpfulSuggestionsList(suggestionsArr, langCode);
        botResponse.innerHTML = "<div class='avatar'><img src='img/ivybot_face.png'></div><div class='content'>" + t.inactivityMessage + '<br>' + suggestionsHtml + "</div>";
        chatBody.appendChild(botResponse);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, INACTIVITY_LIMIT);
}

/**
 * Controls the language confirmation timer for the chatbot session.
 * Usage: languageTimer('start') to start, languageTimer('stop') to stop/clear.
 * After a set delay, prompts the user to reconfirm their language choice via a modal dialog.
 *
 * @param {string} action - 'start' to start the timer, 'stop' to clear it.
 * @returns {void}
 */
function languageTimer(action) {
    clearTimeout(languageConfirmTimer);
    if (action === 'stop') return;
    if (!language) return; // nothing chosen yet
    languageConfirmTimer = setTimeout(() => {
        try {
            const name = language.charAt(0).toUpperCase() + language.slice(1);
            const el = document.getElementById('languageConfirmName');
            if (el) el.textContent = name;
            // Update modal text based on current language
            const modalTitle = document.getElementById('languageConfirmModalLabel');
            const modalBody = document.querySelector('.modal-body');
            const changeBtn = document.getElementById('languageChangeBtn');
            const continueBtn = document.getElementById('languageContinueBtn');
            if (language === 'filipino') {
                if (modalTitle) modalTitle.textContent = 'Napiling Wika';
                if (modalBody) modalBody.innerHTML = 'Sigurado po ba kayong gusto na magpatuloy sa <span id="languageConfirmName">Filipino</span>?';
                if (changeBtn) changeBtn.textContent = 'Baguhin ang Wika';
                if (continueBtn) continueBtn.textContent = 'Magpatuloy';
            } else {
                if (modalTitle) modalTitle.textContent = 'Chosen Language';
                if (modalBody) modalBody.innerHTML = 'Are you sure you want to continue in <span id="languageConfirmName">English</span>?';
                if (changeBtn) changeBtn.textContent = 'Change Language';
                if (continueBtn) continueBtn.textContent = 'Continue';
            }
            // Show the confirmation modal directly (no chat message)
            const modalEl = document.getElementById('languageConfirmModal');
            if (modalEl && window.bootstrap) {
                const bsModal = new bootstrap.Modal(modalEl);
                bsModal.show();
            }
        } catch (err) {
            console.warn('Language confirm modal failed to open', err);
        }
    }, LANGUAGE_CONFIRM_DELAY);
}

// Functionality for user type and email sections
userTypeNext.addEventListener('click', function () {
    userType = userTypeSelect.value;
    if (!userType) {
        alert('Please select your user type.');
        return;
    }
    // helper functions to show/hide sections while keeping CSS-driven layout
    function showSection(section) {
        section.classList.add('visible');
        section.style.display = ''; // remove inline override so CSS rules apply
    }
    function hideSection(section) {
        section.classList.remove('visible');
        section.style.display = 'none';
    }
    hideSection(userTypeSection);
    if (userType === 'Student' || userType === 'Faculty' || userType === 'Staff') {
        showSection(emailSection);
    } else {
        // Only generate ticketId if not already set
        if (!localStorage.getItem('ticketId')) {
            const newTicket = generateTicketId(userType, '');
            localStorage.setItem('ticketId', newTicket);
            // Do NOT persist language/userType; keep them in-memory only
        }
        showSection(questionSection);
        // Autofocus the question input
        const promptInput = document.getElementById('prompt');
        if (promptInput) promptInput.focus();
    }
});


// Email input validation - disable Next button until valid email is entered
schoolEmailInput.addEventListener('input', function () {
    if (schoolEmailInput.checkValidity() && schoolEmailInput.value.trim()) {
        emailNext.disabled = false;
    } else {
        emailNext.disabled = true;
    }
});

// Also check on focus/blur
schoolEmailInput.addEventListener('blur', function () {
    if (schoolEmailInput.checkValidity() && schoolEmailInput.value.trim()) {
        emailNext.disabled = false;
    } else {
        emailNext.disabled = true;
    }
});

emailNext.addEventListener('click', function () {
    schoolEmail = schoolEmailInput.value;
    if (!schoolEmailInput.checkValidity()) {
        alert('Please enter a valid school email.');
        return;
    }
    // Only generate ticketId if not already set
    if (!localStorage.getItem('ticketId')) {
        const newTicket = generateTicketId(userType, schoolEmail);
        localStorage.setItem('ticketId', newTicket);
        // Do NOT persist language/userType; keep them in-memory only
    }
    // reuse helpers from above
    function showSection(section) {
        section.classList.add('visible');
        section.style.display = '';
    }
    function hideSection(section) {
        section.classList.remove('visible');
        section.style.display = 'none';
    }
    hideSection(emailSection);
    showSection(questionSection);
    // Autofocus the question input
    const promptInput = document.getElementById('prompt');
    if (promptInput) promptInput.focus();
});


// Back button from email -> userType
if (emailBack) {
    emailBack.addEventListener('click', function () {
        function showSection(section) {
            section.classList.add('visible');
            section.style.display = '';
        }
        function hideSection(section) {
            section.classList.remove('visible');
            section.style.display = 'none';
        }
        hideSection(emailSection);
        showSection(userTypeSection);
        // Clear user type selection
        userType = '';
        if (userTypeSelect) userTypeSelect.value = '';
        if (userTypeDropdownBtn) userTypeDropdownBtn.textContent = 'Select';
        if (userTypeNext) userTypeNext.disabled = true;
        focusUserTypeControl();
    });
}

// Back button from question -> email or userType depending on userType
if (questionBack) {
    questionBack.addEventListener('click', function () {
        function showSection(section) {
            section.classList.add('visible');
            section.style.display = '';
        }
        function hideSection(section) {
            section.classList.remove('visible');
            section.style.display = 'none';
        }
        hideSection(questionSection);
        if (userType === 'Student' || userType === 'Faculty' || userType === 'Staff') {
            showSection(emailSection);
            schoolEmailInput.focus();
        } else {
            showSection(userTypeSection);
            focusUserTypeControl();
        }
    });
}

// Back button from userType -> language
const userTypeBack = document.getElementById('userTypeBack');
if (userTypeBack) {
    userTypeBack.addEventListener('click', function () {
        // Hide userType section, show language section
        if (userTypeSection) userTypeSection.style.display = 'none';
        const languageSection = document.getElementById('languageSection');
        if (languageSection) languageSection.style.display = '';
        // Reset language selection
        language = '';
        if (languageInput) languageInput.value = '';
        if (languageDropdownBtn) languageDropdownBtn.textContent = 'Select';
        if (languageNext) languageNext.disabled = true;
        // Reset UI prompts/buttons to English by default
        updateUIPromptsForLanguage('english');
        // Start the language confirmation timer
        languageTimer('start');
        // Optionally, focus the language dropdown for accessibility
        if (languageDropdownBtn) languageDropdownBtn.focus();
    });
}

/**
 * Handles chat form submission, sends the user prompt to the server, and updates the chat UI with user and bot messages.
 *
 * @event form#submit
 * @param {Event} e - The form submission event.
 * @returns {Promise<void>}
 */

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous error message
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, userType, schoolEmail, ticketId, language })
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await res.json();

        //generate bot response div
        const botResponse = document.createElement('div');
        botResponse.classList.add('message', 'bot');

        const botMessageAvatar = document.createElement('div');
        botMessageAvatar.classList.add('avatar');
        botMessageAvatar.innerHTML = '<img src="img/ivybot_face.png" alt="IvyBot avatar">';

        const botMessageContent = document.createElement('div');
        botMessageContent.classList.add('content');
        botMessageContent.innerHTML = data.response;

        botResponse.appendChild(botMessageAvatar);
        botResponse.appendChild(botMessageContent);
        chatBody.appendChild(botResponse);
    }
    catch (err) {
        // Show error message in the error-message container
        if (errorMessage) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
        console.log(err);
    }

    //update the view by scrolling to the bottom of the conversation
    chatBody.scrollTop = chatBody.scrollHeight;
    // Always restart inactivity timer after every bot response
    userActivityTimer('start');
});

// Client-side version of helpful suggestions (should match server/data/database.js)
const HELPFUL_SUGGESTIONS = {
    en: [
        "What programs are offered at Ivy Tech?", // PROGRAM_INFO
        "How do I apply for admission?", // ADMISSIONS_INFO_GENERAL
        "Where are the campus locations?", // CAMPUS_INFO_GENERAL
        "How do I access my student portal?", // STUDENT_PORTAL_ACCESS
        "What financial aid options are available?", // FINANCIAL_AID_OPTIONS
        "How do I register for classes?", // CLASS_REGISTRATION
        "Who is the dean?", // DEAN_INFO
        "How do I request my transcripts?", // TRANSCRIPT_REQUEST
        "What are the tuition and fees?", // TUITION_FEES
        "How can I find my advisor?", // FIND_ADVISOR
        "How do I check my academic standing?", // ACADEMIC_STANDING
        "How do I apply for scholarships?", // SCHOLARSHIP_APPLICATION
        "What is the bookstore's location and hours?", // BOOKSTORE_INFO
        "How do I get information about campus events?", // CAMPUS_EVENTS
        "What support is available for online students?", // ONLINE_STUDENT_SUPPORT
        "How do I access online courses?", // IVYONLINE_INFO
        "What is the process for dual credit enrollment?", // DUAL_CREDIT
        "How do I get involved in clubs and organizations?", // STUDENT_LIFE
        "What are the library resources and services?", // LIBRARY_INFO
        "How do I schedule a test?", // TESTING_SERVICES
        "What are the parking options on campus?", // CAMPUS_PARKING
        "How do I get to campus?", // ADDRESS_INFO
        "How do I contact Ivy Tech by phone?", // PHONE_NUMBER_INFO
        "What is the process for applying to the School of IT?", // APPLICATION_PROCESS
        "What are the available programs and courses?", // AVAILABLE_PROGRAMS
        "What certifications or degrees can I earn?", // CERTIFICATION_INFO
        "How do I check the academic calendar?", // ACADEMIC_CALENDAR
        "How do I transfer my credits to a 4-year institution?", // TRANSFER_PROGRAMS_INFO
        "What are the minimum credit hours I can take?", // CREDIT_HOUR_INFO
        "Who teaches SDEV265?", // INSTRUCTOR_INFO_SDEV265
        "Who is the instructor for my course?", // INSTRUCTOR_INFO_GENERAL
        "Where can I find course descriptions and prerequisites?", // COURSE_INFO_GENERAL
        "How many students are at Ivy Tech?", // STUDENT_POPULATION
        "What services are available for military and veterans?", // MILITARY_VETERAN_SERVICES
        "What student services are available?", // STUDENT_SERVICES
        "What class formats are available? (online, hybrid, etc.)", // CLASS_FORMATS
        "How do I enroll at Ivy Tech?", // ENROLLMENT_INFO_GENERAL
        "What is your name?", // BOT_NAME
        "Who created you?", // BOT_IDENTITY
        "How are you today?", // BOT_STATUS
        "Show me some fun facts!", // EASTER_EGG_HITCHHIKER
        "Where can I find library research help?", // LIBRARY_RESEARCH
        "Where can I find library study skills resources?", // LIBRARY_STUDYSKILLS
        "Where can I find library writing and citation help?", // LIBRARY_WRITING
        "Where can I find library handouts?", // LIBRARY_HANDOUTS
        "Where can I get help with library computing?", // LIBRARY_COMPUTING
        "Tell me about cloud technologies programs", // SOIT_PROGRAMS_CLOUD_TECHNOLOGIES
        "What is the computer science program?", // SOIT_PROGRAMS_COMPUTER_SCIENCE
        "What cybersecurity programs do you offer?", // SOIT_PROGRAMS_CYBERSECURITY
        "Tell me about data analytics", // SOIT_PROGRAMS_DATAANALYTICS
        "What information technology programs are available?", // SOIT_PROGRAMS_INFORMATION_TECHNOLOGY
        "What is IT Support program?", // SOIT_PROGRAMS_ITSUPPORT
        "Tell me about network infrastructure", // SOIT_PROGRAMS_NETWORKINFRASTRUCTURE
        "What software development programs are available?", // SOIT_PROGRAMS_SOFTWARE_DEVELOPMENT
    ],
    fil: [
        "Anong mga programa ang inaalok sa Ivy Tech?", // PROGRAM_INFO
        "Paano ako mag-aapply para sa pagpasok?", // ADMISSIONS_INFO_GENERAL
        "Saan matatagpuan ang mga campus?", // CAMPUS_INFO_GENERAL
        "Paano ko maa-access ang aking student portal?", // STUDENT_PORTAL_ACCESS
        "Anong mga opsyon sa pinansyal na tulong ang available?", // FINANCIAL_AID_OPTIONS
        "Paano ako magrerehistro para sa mga klase?", // CLASS_REGISTRATION
        "Sino ang dean?", // DEAN_INFO
        "Paano ko mahihiling ang aking transcript?", // TRANSCRIPT_REQUEST
        "Ano ang mga matrikula at bayarin?", // TUITION_FEES
        "Paano ko mahahanap ang aking tagapayo?", // FIND_ADVISOR
        "Paano ko malalaman ang aking academic standing?", // ACADEMIC_STANDING
        "Paano ako mag-aapply para sa iskolarship?", // SCHOLARSHIP_APPLICATION
        "Ano ang lokasyon at oras ng bookstore?", // BOOKSTORE_INFO
        "Paano ako makakakuha ng impormasyon tungkol sa mga kaganapan sa campus?", // CAMPUS_EVENTS
        "Anong suporta ang available para sa mga online na estudyante?", // ONLINE_STUDENT_SUPPORT
        "Paano ako makaka-access sa mga online na kurso?", // IVYONLINE_INFO
        "Ano ang proseso para sa dual credit enrollment?", // DUAL_CREDIT
        "Paano ako makakasali sa mga klub at organisasyon?", // STUDENT_LIFE
        "Ano ang mga mapagkukunan at serbisyo ng aklatan?", // LIBRARY_INFO
        "Paano ako mag-schedule ng pagsusulit?", // TESTING_SERVICES
        "Ano ang mga pagpipilian sa paradahan sa kampus?", // CAMPUS_PARKING
        "Paano ako makakarating sa campus?", // ADDRESS_INFO
        "Paano ako makakatawag sa Ivy Tech?", // PHONE_NUMBER_INFO
        "Ano ang proseso ng aplikasyon para sa School of IT?", // APPLICATION_PROCESS
        "Ano ang mga available na programa at kurso?", // AVAILABLE_PROGRAMS
        "Anong mga sertipikasyon o degree ang maaari kong makuha?", // CERTIFICATION_INFO
        "Paano ko makikita ang akademikong kalendaryo?", // ACADEMIC_CALENDAR
        "Paano ko maililipat ang aking mga kredito sa 4 na taong institusyon?", // TRANSFER_PROGRAMS_INFO
        "Ano ang pinakamababang yunit ng kurso na maaari kong kunin?", // CREDIT_HOUR_INFO
        "Sino ang nagtuturo ng SDEV265?", // INSTRUCTOR_INFO_SDEV265
        "Sino ang instruktor ng aking kurso?", // INSTRUCTOR_INFO_GENERAL
        "Saan ko makikita ang mga paglalarawan at kinakailangan ng kurso?", // COURSE_INFO_GENERAL
        "Ilan ang mga estudyante sa Ivy Tech?", // STUDENT_POPULATION
        "Anong mga serbisyo para sa militar at beterano?", // MILITARY_VETERAN_SERVICES
        "Anong mga serbisyo para sa mga estudyante?", // STUDENT_SERVICES
        "Anong mga format ng klase ang available? (online, hybrid, atbp.)", // CLASS_FORMATS
        "Paano ako mag-eenroll sa Ivy Tech?", // ENROLLMENT_INFO_GENERAL
        "Ano ang pangalan mo?", // BOT_NAME
        "Sino ang lumikha sa iyo?", // BOT_IDENTITY
        "Kamusta ka ngayon?", // BOT_STATUS
        "Magpakita ka ng nakakatuwang impormasyon!", // EASTER_EGG_HITCHHIKER
        "Saan ako makakahanap ng tulong sa pananaliksik sa aklatan?", // LIBRARY_RESEARCH
        "Saan ako makakahanap ng mga kasanayan sa pag-aaral sa aklatan?", // LIBRARY_STUDYSKILLS
        "Saan ako makakahanap ng tulong sa pagsusulat at pagbanggit sa aklatan?", // LIBRARY_WRITING
        "Saan ako makakakuha ng mga polyeto ng aklatan?", // LIBRARY_HANDOUTS
        "Saan ako makakakuha ng tulong sa kompyuter ng aklatan?", // LIBRARY_COMPUTTING
        "Sabihin mo sa akin ang tungkol sa cloud technologies programs", // SOIT_PROGRAMS_CLOUD_TECHNOLOGIES
        "Ano ang computer science program?", // SOIT_PROGRAMS_COMPUTER_SCIENCE
        "Anong mga cybersecurity programs ang inaalok ninyo?", // SOIT_PROGRAMS_CYBERSECURITY
        "Sabihin mo sa akin ang tungkol sa data analytics", // SOIT_PROGRAMS_DATAANALYTICS
        "Anong mga information technology programs ang available?", // SOIT_PROGRAMS_INFORMATION_TECHNOLOGY
        "Ano ang IT support program?", // SOIT_PROGRAMS_ITSUPPORT
        "Sabihin mo sa akin ang tungkol sa network infrastructure", // SOIT_PROGRAMS_NETWORKINFRASTRUCTURE
        "Anong mga software development programs ang available?", // SOIT_PROGRAMS_SOFTWARE_DEVELOPMENT
    ]
    // Add more languages as needed
};

/**
 * Client side version - Builds a helpful suggestions HTML list for chatbot responses.
 * @param {Array<string>} suggestionsArr - Array of suggestion strings.
 * @param {string} language - Language code ('fil' or 'en').
 * @returns {string} HTML string for the suggestions list, including intro text.
 */
function buildHelpfulSuggestionsList(suggestionsArr, language) {
    const shuffled = suggestionsArr.slice().sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, 3);
    let htmlList = '';
    if (suggestions.length > 0) {
        htmlList = `<ul class="helpful-suggestions-list" aria-label="Example questions you can ask">` + suggestions.map(s => `<li>${s}</li>`).join('') + `</ul>`;
        return (language === 'fil')
            ? `Narito ang ilang halimbawa ng mga tanong na maaari kong sagutin:${htmlList}`
            : `Here are some example questions I can answer:${htmlList}`;
    } else {
        return (language === 'fil')
            ? `Narito ang ilang halimbawa ng mga tanong na maaari kong sagutin.`
            : `Here are some example questions I can answer.`;
    }
}

/**
 * Generates a unique ticket ID for the chatbot session, combining user type, email, and a persistent timestamp.
 *
 * @param {string} userType - The selected user type (e.g., 'Student', 'Guest').
 * @param {string} schoolEmail - The user's school email address (may be empty for guests).
 * @returns {string} The generated ticket ID string.
 */
function generateTicketId(userType, schoolEmail) {
    // Use a persistent timestamp for the session
    let sessionTimestamp = localStorage.getItem('sessionTimestamp');
    if (!sessionTimestamp) {
        sessionTimestamp = Date.now();
        localStorage.setItem('sessionTimestamp', sessionTimestamp);
    }
    return userType + '-' + schoolEmail + '-' + sessionTimestamp;
}

// Translation dictionary for UI prompts/buttons
const translations = {
    english: {
        languagePrompt: "Please select your preferred language to continue",
        userTypePrompt: "Are you a guest, student, faculty, or staff?",
        userTypeBack: "Back",
        userTypeNext: "Next",
        languageNext: "Next",
        userTypeDropdown: "Select",
        languageDropdown: "Select",
        emailPrompt: "Enter your school email",
        emailBack: "Back",
        emailNext: "Next",
        questionPrompt: "Type your question",
        userTypeOptions: ["Guest", "Student", "Faculty", "Staff"],
        languageOptions: ["English", "Filipino"],
        inactivityMessage: "Are you still there? If you need more help, just ask!",
        nav: {
            ivytech: "IvyTech",
            admission: "Admission",
            tuition: "Tuition & Costs",
            campuses: "Campuses",
            libraries: "Libraries"
        }
    },
    filipino: {
        languagePrompt: "Pumili ng nais na wika upang magpatuloy",
        userTypePrompt: "Ikaw ba ay isang bisita, mag-aaral, guro, o kawani?",
        userTypeBack: "Bumalik",
        userTypeNext: "Susunod",
        languageNext: "Susunod",
        userTypeDropdown: "Pumili",
        languageDropdown: "Pumili",
        emailPrompt: "Ilagay ang iyong school email",
        emailBack: "Bumalik",
        emailNext: "Susunod",
        questionPrompt: "I-type ang iyong tanong",
        userTypeOptions: ["Bisita", "Mag-aaral", "Guro", "Kawani"],
        languageOptions: ["Ingles", "Filipino"],
        inactivityMessage: "Nandiyan ka pa ba? Kung kailangan mo pa ng tulong, magtanong lang!",
        nav: {
            ivytech: "IvyTech",
            admission: "Pagpasok",
            tuition: "Matrikula at Gastos",
            campuses: "Mga Kampus",
            libraries: "Mga Aklatan"
        }
    }
};

function getCurrentTranslation() {
    return translations[language] || translations.english;
}

function updateUIPromptsForLanguage(lang) {
    const t = translations[lang] || translations.english;
    // Language section
    const langLabel = document.querySelector('#languageSection label[for="languageDropdownBtn"]');
    if (langLabel) langLabel.textContent = t.languagePrompt;
    if (languageDropdownBtn) languageDropdownBtn.textContent = t.languageDropdown;
    const languageNextBtn = document.getElementById('languageNext');
    if (languageNextBtn) languageNextBtn.textContent = t.languageNext;
    // Update language dropdown options
    const languageDropdownItems = document.querySelectorAll('.language-choice');
    languageDropdownItems.forEach((item, idx) => {
        item.textContent = t.languageOptions[idx] || item.textContent;
    });
    // User type section
    const userTypeLabel = document.querySelector('#userTypeSection label[for="userType"]');
    if (userTypeLabel) userTypeLabel.textContent = t.userTypePrompt;
    if (userTypeDropdownBtn) userTypeDropdownBtn.textContent = t.userTypeDropdown;
    const userTypeBackBtn = document.getElementById('userTypeBack');
    if (userTypeBackBtn) userTypeBackBtn.textContent = t.userTypeBack;
    const userTypeNextBtn = document.getElementById('userTypeNext');
    if (userTypeNextBtn) userTypeNextBtn.textContent = t.userTypeNext;
    // Update user type dropdown options
    const userTypeDropdownItems = document.querySelectorAll('.usertype-choice');
    userTypeDropdownItems.forEach((item, idx) => {
        item.textContent = t.userTypeOptions[idx] || item.textContent;
    });
    // Email section
    const emailLabel = document.querySelector('#emailSection label[for="schoolEmail"]');
    if (emailLabel) emailLabel.textContent = t.emailPrompt;
    const emailInput = document.getElementById('schoolEmail');
    if (emailInput) emailInput.setAttribute('placeholder', t.emailPrompt);
    const emailBackBtn = document.getElementById('emailBack');
    if (emailBackBtn) emailBackBtn.textContent = t.emailBack;
    const emailNextBtn = document.getElementById('emailNext');
    if (emailNextBtn) emailNextBtn.textContent = t.emailNext;
    // Question section
    const questionLabel = document.querySelector('#questionSection label[for="prompt"]');
    if (questionLabel) questionLabel.textContent = t.questionPrompt;
    const questionInput = document.getElementById('prompt');
    if (questionInput) questionInput.setAttribute('placeholder', t.questionPrompt);
    // Navigation
    const navIvyTech = document.getElementById('nav-ivytech');
    if (navIvyTech) navIvyTech.textContent = t.nav.ivytech;
    const navAdmission = document.getElementById('nav-admission');
    if (navAdmission) navAdmission.textContent = t.nav.admission;
    const navTuition = document.getElementById('nav-tuition');
    if (navTuition) navTuition.textContent = t.nav.tuition;
    const navCampuses = document.getElementById('nav-campuses');
    if (navCampuses) navCampuses.textContent = t.nav.campuses;
    const navLibraries = document.getElementById('nav-libraries');
    if (navLibraries) navLibraries.textContent = t.nav.libraries;
}

// Update language UI initialization logic:
try {
    // Language dropdown logic: select language, enable Next
    languageChoices.forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.preventDefault();
            const chosen = item.dataset.lang;
            language = chosen;
            if (languageInput) languageInput.value = chosen;
            // Set dropdown button to the selected language in the correct language
            if (languageDropdownBtn) {
                const t = translations[chosen] || translations.english;
                // Find the index of the selected language in the languageOptions array
                const idx = ['english', 'filipino'].indexOf(chosen);
                if (idx !== -1 && t.languageOptions[idx]) {
                    languageDropdownBtn.textContent = t.languageOptions[idx];
                } else {
                    languageDropdownBtn.textContent = item.textContent;
                }
            }
            // Enable Next button
            if (languageNext) languageNext.disabled = false;
            // Update UI prompts/buttons for selected language
            updateUIPromptsForLanguage(language);
            userActivityTimer('start');
            languageTimer('start');
        });
    });

    // Language Next button logic: advance to user type section
    if (languageNext) {
        languageNext.disabled = true;
        languageNext.addEventListener('click', () => {
            // Stop the language confirmation timer when advancing
            languageTimer('stop');
            const languageSection = document.getElementById('languageSection');
            const userTypeSection = document.getElementById('userTypeSection');
            if (languageSection) languageSection.style.display = 'none';
            if (userTypeSection) {
                userTypeSection.style.display = '';
                focusUserTypeControl();
            }
        });
    }

    // --- userType dropdown wiring: set hidden input, update button label, enable Next ---
    if (usertypeChoices && userTypeDropdownBtn) {
        // initialize state of Next button
        maybeEnableUserTypeNext();
        usertypeChoices.forEach(item => {
            item.addEventListener('click', (ev) => {
                ev.preventDefault();
                const val = item.dataset.value;
                if (userTypeSelect) userTypeSelect.value = val;
                if (userTypeDropdownBtn) userTypeDropdownBtn.textContent = item.textContent;
                // Only enable Next if both language and userType are selected
                maybeEnableUserTypeNext();
                // Do NOT persist userType to localStorage; keep it in-memory only
                // reset timers when user interacts
                userActivityTimer('start');
            });
        });
    }

    // Helper to enable Next button only if both language and userType are selected
    function maybeEnableUserTypeNext() {
        if (userTypeNext) {
            if (userTypeSelect && userTypeSelect.value && language) {
                userTypeNext.disabled = false;
            } else {
                userTypeNext.disabled = true;
            }
        }
    }

    // Modal buttons
    const languageContinueBtn = document.getElementById('languageContinueBtn');
    const languageChangeBtn = document.getElementById('languageChangeBtn');
    const modalEl = document.getElementById('languageConfirmModal');

    if (languageContinueBtn) {
        languageContinueBtn.addEventListener('click', () => {
            // Commit the pending language selection (from the 3-minute timer modal)
            if (pendingLanguage) {
                language = pendingLanguage;
                if (languageInput) languageInput.value = pendingLanguage;
                if (languageDropdownBtn) languageDropdownBtn.textContent = pendingLanguage.charAt(0).toUpperCase() + pendingLanguage.slice(1);
                pendingLanguage = null;
            }
            userActivityTimer('start');
            console.log('Continue clicked, language:', language);
        });
    }

    if (languageChangeBtn) {
        languageChangeBtn.addEventListener('click', () => {
            console.log('Change Language clicked');
            // User chose to change language mid-session
            // Set flag to indicate we're in "change language" flow
            isChangingLanguage = true;
            // Discard the pending selection and prepare for new language selection
            pendingLanguage = null;
            // Show the language hint and menu again
            const hintEl = document.querySelector('.language-hint');
            if (hintEl) hintEl.style.display = '';
            const menuEl = document.querySelector('.language-menu');
            if (menuEl) menuEl.style.display = '';
            // Hide question/email sections temporarily (userType stays hidden, we'll show question again after selection)
            if (emailSection) emailSection.style.display = 'none';
            if (questionSection) questionSection.style.display = 'none';
            // DO NOT reset userType and email - keep them so user doesn't have to re-select
            // Clear timers to avoid interference while selecting new language
            languageTimer('stop');
            userActivityTimer('start');

            // Wait for modal to close, then open language dropdown
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) {
                    // Listen for hidden event on modal
                    modalEl.addEventListener('hidden.bs.modal', function showDropdown() {
                        setTimeout(() => {
                            if (languageDropdownBtn && window.bootstrap) {
                                const dropdown = new bootstrap.Dropdown(languageDropdownBtn);
                                dropdown.show();
                                languageDropdownBtn.focus();
                            }
                        }, 100);
                        // Remove this listener after it fires once
                        modalEl.removeEventListener('hidden.bs.modal', showDropdown);
                    }, { once: true });
                }
            }
        });
    }
} catch (err) {
    console.warn('Language UI initialization failed', err);
}
