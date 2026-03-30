
/**
 * Reply Controller
 *
 * This module handles the construction of chatbot responses for various detected intents and user queries.
 * It provides functions to build responses for campus information, course lookups, error handling, and more.
 *
 * Exports:
 *   - getAddressResponse: Build address response for a campus location
 *   - getPhoneResponse: Build phone/contact response for a campus location
 *   - getDeanResponse: Build dean information response for a campus location
 *   - buildResponse: Main function to build a chatbot response based on intent and options
 *   - getErrorResponse: Get a random error response in the specified language
 *   - isErrorResponse: Check if a response is an error statement
 *
 * @module controllers/replyController
 */
const { responses, locations, INTENT, LANGUAGE, COURSE_PREFIXES } = require('../data/database');
const { ENG_ERROR_STATEMENTS, FIL_ERROR_STATEMENTS } = require('./languageController');


/**
 * Builds a reusable styled link button with an external link icon.
 * @param {string} url - The URL to link to.
 * @param {string} label - The button label text.
 * @returns {string} HTML for the button.
 */
function buildLinkButton(url, label) {
    // Uses button[type="button"] for consistent dark green styling via CSS and adds aria-label for a11y
    return `<button type="button" onclick="window.open('${url}', '_blank')" class="d-inline-flex align-items-center gap-2" aria-label="${label} (opens in new tab)">
        ${label}
        <i class='bx bx-link-external' aria-hidden="true"></i>
    </button>`;
}

/**
 * Constructs a WhitePages search URL for staff or faculty lookup based on provided parameters.
 *
 * @param {string} firstName - First name of the person to search for.
 * @param {string} lastName - Last name of the person to search for.
 * @param {string} location - Campus or location name.
 * @param {string} role - Role to filter by (e.g., 'faculty').
 * @param {string} title - Title to filter by (e.g., 'Dean').
 * @returns {string} A URL string for the WhitePages search.
 */
function buildWhitePagesURL(firstName, lastName, location, role, title) {
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}

/**
 * Constructs a course catalog search URL for a given course code.
 *
 * @param {string} courseCode - The course code to search for (e.g., 'CSCI101').
 * @returns {string} A URL string for the course catalog search.
 */
function buildCourseCatalogURL(courseCode) {
    return `https://catalog.ivytech.edu/search_advanced.php?cur_cat_oid=0&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=${encodeURIComponent(courseCode.toUpperCase())}&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1`;
}

/**
 * Returns a random error response in the specified language.
 * Used when the chatbot cannot understand or process a user's query.
 *
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the error response.
 * @returns {string} A randomly selected error response string.
 */
function getErrorResponse(language = LANGUAGE.ENGLISH) {
    const index = Math.floor(Math.random() * 3);
    return language === LANGUAGE.FILIPINO ? FIL_ERROR_STATEMENTS[index] : ENG_ERROR_STATEMENTS[index];
}
/**
 * Builds a formatted address response for a given campus location index.
 * Includes campus name, address, and links to campus page and Google Maps.
 *
 * @param {number} locIdx - Index of the campus location in the locations array.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the response.
 * @returns {string} The formatted address response, or a prompt to specify campus if not found.
 */
function getAddressResponse(locIdx, language = LANGUAGE.ENGLISH) {
    console.log('Getting address response for location index:', locIdx);
    let response = '';
    if (locIdx > -1) {
        console.log("Matched location title:", locations[locIdx].title);
        response = `<strong>${locations[locIdx].title} Campus Location:</strong><br>`;
        response += locations[locIdx].address;
        response += `<br>` + buildLinkButton(`https://www.ivytech.edu/${locations[locIdx].url}`, 'Campus Page');
        response += `<br>` + buildLinkButton(`https://www.google.com/maps/search/?api=1&query=${locations[locIdx].position.lat},${locations[locIdx].position.lng}`, 'Google Maps');
    } else {
        response = language === LANGUAGE.FILIPINO
            ? "Kaya ko pong hanapin iyon para sa iyo. Aling campus ang gusto niyo pong makuha ang address?"
            : "I can look that up for you. Which campus do you want the address of?";
    }
    return response;
}

/**
 * Builds a formatted phone/contact response for a given campus location index.
 * Includes campus name, phone number, email, and campus page link.
 *
 * @param {number} locIdx - Index of the campus location in the locations array.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the response.
 * @returns {string} The formatted phone/contact response, or a prompt to specify campus if not found.
 */
function getPhoneResponse(locIdx, language = LANGUAGE.ENGLISH) {
    let response = '';
    if (locIdx > -1) {
        response = `<strong>${locations[locIdx].title} Campus Contact Info:</strong><br><br>`;
        response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIdx].phone}'>${locations[locIdx].phone}</a><br>`;
        response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIdx].email}">${locations[locIdx].email}</a>`;
        response += `<br>` + buildLinkButton(`https://www.ivytech.edu/${locations[locIdx].url}`, 'Campus Page');
    } else {
        response = language === LANGUAGE.FILIPINO
            ? "Aling kampus ang tinutukoy niyo po? O gusto niyo po ba ang 24 oras na toll-free na numero?"
            : "Which campus are you talking about? Or would you like the 24 hour toll free number?";
    }
    return response;
}

/**
 * Builds a response containing dean information for a given campus location index.
 * Includes a link to the White Pages for dean search.
 *
 * @param {number} locIdx - Index of the campus location in the locations array.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the response.
 * @returns {string} The formatted dean information response, or a prompt to specify campus if not found.
 */
function getDeanResponse(locIdx, language = LANGUAGE.ENGLISH) {
    let response = '';
    if (locIdx > -1) {
        let deanResponse = responses.find(r => r.intent === INTENT.DEAN_INFO);
        deanResponse = language === LANGUAGE.FILIPINO ? (deanResponse.reply.fil || deanResponse.reply.en) : (deanResponse.reply.en || deanResponse.reply.fil);
        response = `<strong>${deanResponse}</strong><br>`;
        response += `<br>` + buildLinkButton(buildWhitePagesURL('', '', locations[locIdx].title, 'faculty', 'Dean'), 'White Pages');
        return response;
    } else {
        response = language === LANGUAGE.FILIPINO
            ? 'Hmm.. aling kampus ang gusto niyo pong mong impormasyon tungkol sa dean? Maaari niyo rin pong sundan ang link na ito para mahanap sa White Pages tungkol sa mga dean: '
            : 'Hmm.. which campus are you wanting dean information for? You can also follow this link to search the White Pages for the dean: ';
        response += buildLinkButton(buildWhitePagesURL('', '', '', 'faculty', 'Dean'), 'White Pages');
    }
    return response;
}

/**
 * Builds a reply string from a matched response object, including any associated link if present.
 *
 * @param {Object} matchedResponse - The matched response object from the responses array.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the reply.
 * @returns {string|null} The reply string, or null if no matched response is provided.
 */
function getResponseReply(matchedResponse, language = LANGUAGE.ENGLISH) {
    if (!matchedResponse) return null;
    let response = language === LANGUAGE.FILIPINO ? (matchedResponse.reply.fil || matchedResponse.reply.en) : (matchedResponse.reply.en || matchedResponse.reply.fil);
    if (matchedResponse.url) {
        response += `<br><br>` + buildLinkButton(matchedResponse.url, matchedResponse.link || 'More Info');
    }
    return response;
}

/**
 * Builds a general course information response for a given course code.
 * If a course code is provided, returns a formatted response with a link to the course catalog.
 * If not, falls back to a generic course info response.
 *
 * @param {string|null} courseCode - The course code to look up, or null if not provided.
 * @param {Object} matchedResponse - The matched response object for course info.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the response.
 * @returns {string} The formatted course information response.
 */
function getCourseGeneralResponse(courseCode, matchedResponse, language = LANGUAGE.ENGLISH) {
    let response = '';

    if (courseCode) {
        const courseUpper = courseCode.toUpperCase();
        
        response = language === LANGUAGE.FILIPINO
            ? `Narito po ang impormasyon para sa kursong <strong>${courseUpper}</strong> sa kasalukuyang catalog:<br><br>`
            : `Here is the information for course <strong>${courseUpper}</strong> in the current catalog:<br><br>`;

        const courseLink = buildCourseCatalogURL(courseCode);
        response += buildLinkButton(courseLink, `View ${courseUpper} Details`);

        // Fallback warning if prefix not recognized (already in your previous version)
        if (!COURSE_PREFIXES.some(prefix => courseUpper.startsWith(prefix))) {
            response += language === LANGUAGE.FILIPINO
                ? `<br><br><small class="text-warning">Paunawa: Hindi ko po kinikilala ang prefix na ito. Pakisigurado na ito ay wastong Ivy Tech course code.</small>`
                : `<br><br><small class="text-warning">Note: I do not recognize this course code prefix. Please ensure it is a valid Ivy Tech course code.</small>`;
        }
    } 
    else if (matchedResponse) {
        response = getResponseReply(matchedResponse, language);
    } 
    else {
        const infoResponse = responses.find(r => r.intent === INTENT.COURSE_INFO_GENERAL);
        response = language === LANGUAGE.FILIPINO 
            ? (infoResponse.reply.fil || infoResponse.reply.en)
            : (infoResponse.reply.en || infoResponse.reply.fil);
    }

    return response;
}
/**
 * Builds the chatbot's response based on the matched intent and provided options.
 * Handles all supported intents, including address, phone, dean, and course info.
 *
 * @param {Object} matchedResponse - The matched response object for the detected intent.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language for the response.
 * @param {Object} [opts={}] - Additional options: locIdx (location index), session (conversation session), courseCode (course code).
 * @returns {string} The chatbot's response string.
 */
function buildResponse(matchedResponse, language = LANGUAGE.ENGLISH, opts = {}) {
    const locIdx = opts.locIdx || null;
    const session = opts.session || null;
    const courseCode = opts.courseCode || null;

    if (!matchedResponse && !session)
        return getErrorResponse(language);

    let intent = matchedResponse ? matchedResponse.intent : session.currentIntent;
    if (!intent) 
        intent = INTENT.UNKNOWN;

    console.log('Building response for intent:', intent);
    console.log('Location index for response:', locIdx);
    console.log('Language for response:', language);
    console.log('Matched response object:', matchedResponse);
    console.log('Session data:', session);
    console.log('Course code for response:', courseCode);

    switch (intent) {
        case INTENT.ADDRESS_INFO:
            return getAddressResponse(locIdx, language);
        case INTENT.PHONE_NUMBER_INFO:
            return getPhoneResponse(locIdx, language);
        case INTENT.DEAN_INFO:
            return getDeanResponse(locIdx, language);
        case INTENT.COURSE_INFO_GENERAL:
            return getCourseGeneralResponse(courseCode, matchedResponse, language);
        default:
            return matchedResponse 
                ? getResponseReply(matchedResponse, language)
                : getErrorResponse(language); 
        } 
}

/**
 * Checks if a given response string is one of the known error statements for the specified language.
 *
 * @param {string} response - The response string to check.
 * @param {string} [language=LANGUAGE.ENGLISH] - The language to check error statements for.
 * @returns {boolean} True if the response is an error statement, false otherwise.
 */
function isErrorResponse(response, language = LANGUAGE.ENGLISH) {
    const errorStatements = language === LANGUAGE.FILIPINO ? FIL_ERROR_STATEMENTS : ENG_ERROR_STATEMENTS;
    return errorStatements.includes(response);
}

module.exports = {
    getAddressResponse,
    getPhoneResponse,
    getDeanResponse,
    buildResponse,
    getErrorResponse,
    isErrorResponse,
    buildLinkButton,
};
