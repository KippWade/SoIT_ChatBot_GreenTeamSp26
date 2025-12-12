/*
    Clear ticketId and sessionTimestamp on page load to ensure a fresh ticket on every refresh.
    This way, each refresh generates a new ticket and language selection resets.
    Once a language is selected in the current session, it persists until the 3-minute timer fires or the page is refreshed.
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
let language = '';
const LANGUAGE_CONFIRM_DELAY = 3 * 60 * 1000; // 3 minutes before re-confirming language
let languageConfirmTimer;
let pendingLanguage = null; // language chosen but awaiting confirmation
let isChangingLanguage = false; // Flag to track if user is in "change language" flow

// Helper to focus the visible user type control
function focusUserTypeControl() {
    if (userTypeDropdownBtn) userTypeDropdownBtn.focus();
    else if (userTypeSelect) userTypeSelect.focus();
}

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
    // Language reconfirm timer should follow user activity
    resetLanguageConfirmTimer();
}

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
            body: JSON.stringify({ prompt, userType, schoolEmail, ticketId, language })
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
    resetLanguageConfirmTimer();
});


function generateTicketId(userType, schoolEmail) {
    // Use a persistent timestamp for the session
    let sessionTimestamp = localStorage.getItem('sessionTimestamp');
    if (!sessionTimestamp) {
        sessionTimestamp = Date.now();
        localStorage.setItem('sessionTimestamp', sessionTimestamp);
    }
    return userType + '-' + schoolEmail + '-' + sessionTimestamp;
}

// Initialize language UI from localStorage and wire up language choice clicks + modal buttons
try {
    languageChoices.forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.preventDefault();
            const chosen = item.dataset.lang;
            // First-time selection for this session: commit immediately and continue flow
            if (!language) {
                language = chosen;
                if (languageInput) languageInput.value = chosen;
                if (languageDropdownBtn) languageDropdownBtn.textContent = item.textContent;
                // hide language hint and menu after selection
                const hintEl = document.querySelector('.language-hint');
                if (hintEl) hintEl.style.display = 'none';
                const menuEl = document.querySelector('.language-menu');
                if (menuEl) menuEl.style.display = 'none';
                
                // Show userType section
                if (userTypeSection) {
                    userTypeSection.style.display = '';
                    focusUserTypeControl();
                }
                
                // reset timers
                resetInactivityTimer();
                resetLanguageConfirmTimer();
                return;
            }

            // If user is in "Change Language" flow, commit immediately (no modal needed)
            if (isChangingLanguage) {
                isChangingLanguage = false;
                language = chosen;
                if (languageInput) languageInput.value = chosen;
                if (languageDropdownBtn) languageDropdownBtn.textContent = item.textContent;
                // hide language hint and menu
                const hintEl = document.querySelector('.language-hint');
                if (hintEl) hintEl.style.display = 'none';
                const menuEl = document.querySelector('.language-menu');
                if (menuEl) menuEl.style.display = 'none';
                // Show question section directly (skip role/email since already selected)
                if (emailSection) emailSection.style.display = 'none';
                if (userTypeSection) userTypeSection.style.display = 'none';
                if (questionSection) {
                    questionSection.style.display = '';
                    const promptEl = document.getElementById('prompt');
                    if (promptEl) {
                        promptEl.focus();
                    }
                }
                
                // reset timers
                resetInactivityTimer();
                resetLanguageConfirmTimer();
                return;
            }

            // Language change after "Change Language" button (userType and email already set)
            if (!userType) {
                // This shouldn't happen, but just in case
                language = chosen;
                if (languageInput) languageInput.value = chosen;
                if (languageDropdownBtn) languageDropdownBtn.textContent = item.textContent;
                // hide language hint and menu
                const hintEl = document.querySelector('.language-hint');
                if (hintEl) hintEl.style.display = 'none';
                const menuEl = document.querySelector('.language-menu');
                if (menuEl) menuEl.style.display = 'none';
                // show userType
                if (userTypeSection) {
                    userTypeSection.style.display = '';
                    focusUserTypeControl();
                }
                resetInactivityTimer();
                resetLanguageConfirmTimer();
                return;
            }

            // If we already have a userType, we're resuming conversation after language change
            language = chosen;
            if (languageInput) languageInput.value = chosen;
            if (languageDropdownBtn) languageDropdownBtn.textContent = item.textContent;
            // hide language hint and menu
            const hintEl = document.querySelector('.language-hint');
            if (hintEl) hintEl.style.display = 'none';
            const menuEl = document.querySelector('.language-menu');
            if (menuEl) menuEl.style.display = 'none';
            // Show question section directly (skip role/email since already selected)
            if (emailSection) emailSection.style.display = 'none';
            if (userTypeSection) userTypeSection.style.display = 'none';
            if (questionSection) {
                questionSection.style.display = '';
                const promptEl = document.getElementById('prompt');
                if (promptEl) {
                    promptEl.focus();
                }
            }
            
            // reset timers
            resetInactivityTimer();
            resetLanguageConfirmTimer();
        });
    });

    // --- userType dropdown wiring: set hidden input, update button label, enable Next ---
    if (usertypeChoices && userTypeDropdownBtn) {
        // initialize state of Next button
        if (userTypeSelect && userTypeSelect.value) {
            userTypeDropdownBtn.textContent = userTypeSelect.value;
            if (userTypeNext) userTypeNext.disabled = false;
        } else {
            if (userTypeNext) userTypeNext.disabled = true;
        }

        usertypeChoices.forEach(item => {
            item.addEventListener('click', (ev) => {
                ev.preventDefault();
                const val = item.dataset.value;
                if (userTypeSelect) userTypeSelect.value = val;
                if (userTypeDropdownBtn) userTypeDropdownBtn.textContent = item.textContent;
                if (userTypeNext) userTypeNext.disabled = false;
                // Do NOT persist userType to localStorage; keep it in-memory only
                // reset timers when user interacts
                resetInactivityTimer();
                resetLanguageConfirmTimer();
            });
        });
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