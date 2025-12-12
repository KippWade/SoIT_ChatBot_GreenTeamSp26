const { responses, locations, INTENT, LANGUAGE, COURSE_PREFIXES } = require('../data/database');
const { ENG_ERROR_STATEMENTS, FIL_ERROR_STATEMENTS } = require('./languageController');

const suffix = "&nbsp;<i class='bx bx-link-external'></i></a>"; // External link icon

// Build WhitePages URL helper
function buildWhitePagesURL(firstName, lastName, location, role, title) {
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}

//Build course catelog URL helper
function buildCourseCatalogURL(courseCode) {
    return `https://catalog.ivytech.edu/search_advanced.php?cur_cat_oid=9&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=${encodeURIComponent(courseCode.toUpperCase())}&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1`;
}

function getErrorResponse(language = LANGUAGE.ENGLISH) {
    const index = Math.floor(Math.random() * 3);
    return language === LANGUAGE.FILIPINO ? FIL_ERROR_STATEMENTS[index] : ENG_ERROR_STATEMENTS[index];
}
function getAddressResponse(locIdx, language = LANGUAGE.ENGLISH) {
    console.log('Getting address response for location index:', locIdx);
    let response = '';
    if (locIdx > -1) {
        console.log("Matched location title:", locations[locIdx].title);
        response = `<strong>${locations[locIdx].title} Campus Location:</strong><br>`;
        response += locations[locIdx].address;
        response += `<br><a href='https://www.ivytech.edu/${locations[locIdx].url}' target='_blank'>Campus Page</a>`;
        response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${locations[locIdx].position.lat},${locations[locIdx].position.lng}' target='_blank'>Google Maps</a>`;
    } else {
        response = language === LANGUAGE.FILIPINO
            ? "Kaya ko pong hanapin iyon para sa iyo. Aling campus ang gusto niyo pong makuha ang address?"
            : "I can look that up for you. Which campus do you want the address of?";
    }
    return response;
}

function getPhoneResponse(locIdx, language = LANGUAGE.ENGLISH) {
    let response = '';
    if (locIdx > -1) {
        response = `<strong>${locations[locIdx].title} Campus Contact Info:</strong><br><br>`;
        response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${locations[locIdx].phone}'>${locations[locIdx].phone}</a><br>`;
        response += `<i class='bx bxs-envelope' ></i>&nbsp;&nbsp;<a href="mailto:${locations[locIdx].email}">${locations[locIdx].email}</a>`;
        response += `<br><a href='https://www.ivytech.edu/${locations[locIdx].url}' target='_blank'>Campus Page${suffix}`;
    } else {
        response = language === LANGUAGE.FILIPINO
            ? "Aling kampus ang tinutukoy niyo po? O gusto niyo po ba ang 24 oras na toll-free na numero?"
            : "Which campus are you talking about? Or would you like the 24 hour toll free number?";
    }
    return response;
}

function getDeanResponse(locIdx, language = LANGUAGE.ENGLISH) {
    let response = '';
    if (locIdx > -1) {
        let deanResponse = responses.find(r => r.intent === INTENT.DEAN_INFO);
        deanResponse = language === LANGUAGE.FILIPINO ? (deanResponse.reply.fil || deanResponse.reply.en) : (deanResponse.reply.en || deanResponse.reply.fil);
        response = `<strong>${deanResponse}</strong><br>`;
        response += `<br><a href='${buildWhitePagesURL('', '', locations[locIdx].title, 'faculty', 'Dean')}' target='_blank'>White Pages&nbsp;<i class='bx bx-link-external'></i></a>`;
        return response;
    } else {
        response = language === LANGUAGE.FILIPINO
            ? 'Hmm.. aling kampus ang gusto niyo pong mong impormasyon tungkol sa dean? Maaari niyo rin pong sundan ang link na ito para mahanap sa White Pages tungkol sa mga dean: '
            : 'Hmm.. which campus are you wanting dean information for? You can also follow this link to search the White Pages for the dean: ';
        response += '<a href="' + buildWhitePagesURL('', '', '', 'faculty', 'Dean') + '" target="_blank">White Pages</a>';
    }
    return response;
}

function getResponseReply(matchedResponse, language = LANGUAGE.ENGLISH) {
    if (!matchedResponse) return null;
    response = language === LANGUAGE.FILIPINO ? (matchedResponse.reply.fil || matchedResponse.reply.en) : (matchedResponse.reply.en || matchedResponse.reply.fil);
    if (matchedResponse.url) {
        response += `<br><br><a href='${matchedResponse.url}' target='_blank'>${matchedResponse.link}${suffix}`;
    }
    return response;
}

function getCourseGeneralResponse(courseCode, matchedResponse, language = LANGUAGE.ENGLISH) {
    let response = '';
    if (courseCode) {
        switch (language) {
            case LANGUAGE.FILIPINO:
                response = `Narito po ang impormasyon para sa kursong <strong>${courseCode.toUpperCase()}</strong>:<br><br>`;
                break;
            case LANGUAGE.ENGLISH:
            default:
                response = `Here is the information for course  <strong>${courseCode.toUpperCase()}</strong>:<br><br>`;
                break;
        }
        let courseLink = buildCourseCatalogURL(courseCode);
        response += `<a href='${courseLink}' target='_blank'>Course Details</a>`;

        if(!COURSE_PREFIXES.some(prefix => courseCode.toUpperCase().startsWith(prefix))) {
            switch (language) {
                case LANGUAGE.FILIPINO:
                    response += `<br><br>Paunawa Po: Hindi ko po kinikilala ang prefix ng course code. Mangyaring tiyakin na ito ay isang wastong Ivy Tech course code.`;
                    break;
                case LANGUAGE.ENGLISH:
                default:
                    response += `<br><br>Note: I do not recognize the course code prefix. Please ensure it is a valid Ivy Tech course code.`;
                    break;
            }
        }
    } else if (matchedResponse) {
        response = getResponseReply(matchedResponse, language);
    } else {
        let infoResponse = responses.find(r => r.intent === INTENT.COURSE_INFO_GENERAL);
        switch (language) {
            case LANGUAGE.FILIPINO:
                response = infoResponse.reply.fil || infoResponse.reply.en;
                break;
            case LANGUAGE.ENGLISH:
            default:
                response = infoResponse.reply.en || infoResponse.reply.fil;
                break;
        }
    }

    return response;
}

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
            if (matchedResponse) {
                return getResponseReply(matchedResponse, language);
            }
            return getErrorResponse(language); 
        } 
}

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
};