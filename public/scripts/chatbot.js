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
 * Resets the inactivity timer for the chatbot session.
 * If the user is inactive for the defined limit, a bot message prompts for activity.
 * Also resets the language confirmation timer to follow user activity.
 *
 * @returns {void}
 */
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const chatBody = document.getElementById('chat-body');
        const botResponse = document.createElement('div');
        botResponse.classList.add('message', 'bot');
        const t = getCurrentTranslation();
        botResponse.innerHTML = "<div class='avatar'><img src='img/ivybot_face.png'></div><div class='content'>" + t.inactivityMessage + "</div>";
        chatBody.appendChild(botResponse);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, INACTIVITY_LIMIT);
    // Language reconfirm timer should follow user activity
    resetLanguageConfirmTimer();
}

/**
 * Resets the language confirmation timer for the chatbot session.
 * After a set delay, prompts the user to reconfirm their language choice via a modal dialog.
 *
 * @returns {void}
 */
function resetLanguageConfirmTimer() {
    clearTimeout(languageConfirmTimer);
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
            
            // this is where would the other languages would change the modal text to
            // user's chosen language
            if (language === 'filipino') {
                if (modalTitle) modalTitle.textContent = 'Napiling Wika';
                if (modalBody) modalBody.innerHTML = 'Sigurado po ba kayong gusto na magpatuloy sa <span id="languageConfirmName">Filipino</span>?';
                if (changeBtn) changeBtn.textContent = 'Baguhin ang Wika';
                if (continueBtn) continueBtn.textContent = 'Magpatuloy';
            } else { // this would always be in English
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
userTypeNext.addEventListener('click', function() {
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
schoolEmailInput.addEventListener('input', function() {
    if (schoolEmailInput.checkValidity() && schoolEmailInput.value.trim()) {
        emailNext.disabled = false;
    } else {
        emailNext.disabled = true;
    }
});

// Also check on focus/blur
schoolEmailInput.addEventListener('blur', function() {
    if (schoolEmailInput.checkValidity() && schoolEmailInput.value.trim()) {
        emailNext.disabled = false;
    } else {
        emailNext.disabled = true;
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
    emailBack.addEventListener('click', function() {
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
    questionBack.addEventListener('click', function() {
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
    userTypeBack.addEventListener('click', function() {
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
        // Restart the language confirmation timer
        resetLanguageConfirmTimer();
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
            headers: { 'Content-Type': 'application/json'},
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
    resetInactivityTimer();
    resetLanguageConfirmTimer();
});


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
            campuses: "Campuses"
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
            campuses: "Mga Kampus"
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
    const emailBackBtn = document.getElementById('emailBack');
    if (emailBackBtn) emailBackBtn.textContent = t.emailBack;
    const emailNextBtn = document.getElementById('emailNext');
    if (emailNextBtn) emailNextBtn.textContent = t.emailNext;
    // Question section
    const questionLabel = document.querySelector('#questionSection label[for="prompt"]');
    if (questionLabel) questionLabel.textContent = t.questionPrompt;
    // Navigation
    const navIvyTech = document.getElementById('nav-ivytech');
    if (navIvyTech) navIvyTech.textContent = t.nav.ivytech;
    const navAdmission = document.getElementById('nav-admission');
    if (navAdmission) navAdmission.textContent = t.nav.admission;
    const navTuition = document.getElementById('nav-tuition');
    if (navTuition) navTuition.textContent = t.nav.tuition;
    const navCampuses = document.getElementById('nav-campuses');
    if (navCampuses) navCampuses.textContent = t.nav.campuses;
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
            if (languageDropdownBtn) languageDropdownBtn.textContent = item.textContent;
            // Enable Next button
            if (languageNext) languageNext.disabled = false;
            // Update UI prompts/buttons for selected language
            updateUIPromptsForLanguage(language);
            resetInactivityTimer();
            resetLanguageConfirmTimer();
        });
    });

    // Language Next button logic: advance to user type section
    if (languageNext) {
        languageNext.disabled = true;
        languageNext.addEventListener('click', () => {
            // Stop the language confirmation timer when advancing
            clearTimeout(languageConfirmTimer);
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
                resetInactivityTimer();
                resetLanguageConfirmTimer();
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
            // Restart the 3-minute language confirmation timer
            resetLanguageConfirmTimer();
            resetInactivityTimer();
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
            clearTimeout(languageConfirmTimer);
            clearTimeout(inactivityTimer);
            
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