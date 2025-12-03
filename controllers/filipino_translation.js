const fuzz = require('fuzzball');
const filipinoTranslations = require('../data/filipino_translation_inquires.json');
const { locations, INTENT } = require('../data/database');

// Build WhitePages URL helper
function buildWhitePagesURL(firstName, lastName, location, role, title) {
    return `https://whitepages.ivytech.edu/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&userid=&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&bee_syrup_tun=&submit=+Search+`;
}

// Simple Filipino language detection (checks for common Filipino words)
function isFilipino(text) {
    const filipinoKeywords = [
        'ano', 'sino', 'saan', 'paano', 'anong', 'sinong', 'saang', 'paanong', 'kailan', 'kailangang',
        'po', 'opo', 'natanggap', 'matanggap', 'mga', 'salamat', 'tulong', 'presyo', 'libre', 'libreng', 'bayad', 'bukas', 'sarado', 'oras',
        'kumusta',
        'kurso', 'martikula', 'admisyon', 'pag enroll', 'pag-enroll', 'enroll', 'mag-enroll', 'mag enroll', 'mag-apply', 'mag apply', 'apply',
        'pag', 'mag', 'nag', 'namamahala', 'guro', 'titser', 'eskwela', 'paaralan', 'kolehiyo', 'punong-guro', 'panukalan', 
        'kompyuter', 'teknolohiya', 'teknikal', 'siyensiya', 'agham', 'matematika', 'kamusta', 'hoy', 'oy', 'huy', 'uy', 'kamusta ka', 'kumusta ka',
        'asosado', 'dekano', 'kurikulum', 'pwede', 'puede'
    ];
    const lowerText = text.toLowerCase();
    // Only match whole words to avoid false positives
    return filipinoKeywords.some(word => {
        const wordRegex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return wordRegex.test(lowerText);
    });
}

function translateFilipinoToEnglish(prompt) {
    let bestMatch = null;
    let bestScore = 0;
    let bestVariantIndex = -1;
    const lowerPrompt = (prompt || '').toLowerCase().trim();

    for (const pair of filipinoTranslations) {
        const filipinoVariants = Array.isArray(pair.filipino) ? pair.filipino : [pair.filipino];

        // Fast exact-match short-circuit: if any Filipino variant exactly equals the prompt, return the english mapping at the same index (if present)
        for (let i = 0; i < filipinoVariants.length; i++) {
            const variantExact = filipinoVariants[i];
            if (variantExact && variantExact.toLowerCase().trim() === lowerPrompt) {
                if (Array.isArray(pair.english) && pair.english[i]) {
                    return pair.english[i];
                }
                return Array.isArray(pair.english) ? pair.english[0] : pair.english;
            }
        }

        // Fuzzy scoring fallback (remember which variant index produced the best score)
        for (let i = 0; i < filipinoVariants.length; i++) {
            const variant = filipinoVariants[i];
            const score = fuzz.token_set_ratio((variant || '').toLowerCase(), lowerPrompt);
            if (score > bestScore && score > 75) {
                bestScore = score;
                bestMatch = pair;
                bestVariantIndex = i;
            }
        }
    }

    if (bestMatch) {
        if (Array.isArray(bestMatch.english) && bestMatch.english[bestVariantIndex]) {
            return bestMatch.english[bestVariantIndex];
        }
        return Array.isArray(bestMatch.english) ? bestMatch.english[0] : bestMatch.english;
    }
    return prompt;
}

// Append links (White Pages, campus pages, or matchedResponse.url) to a response string
function enhanceWithLinks(response, matchedResponse, opts = {}) {
    const suffix = opts.suffix || "&nbsp;<i class='bx bx-link-external'></i></a>";
    const originalLocIndex = typeof opts.originalLocIndex === 'number' ? opts.originalLocIndex : -1;
    const deanLocIndex = typeof opts.deanLocIndex === 'number' ? opts.deanLocIndex : -1;

    if (!matchedResponse) return response;

    // For location-specific queries, build formatted response with campus info
    if (matchedResponse.intent === INTENT.ADDRESS_INFO || matchedResponse.intent === INTENT.PHONE_NUMBER_INFO) {
        if (originalLocIndex > -1) {
            const location = locations[originalLocIndex];
            
            if (matchedResponse.intent === INTENT.ADDRESS_INFO) {
                response = `<strong>${location.title} Campus:</strong><br>${location.address}`;
                response += `<br><br><a href='https://www.ivytech.edu/${location.url}' target='_blank'>Campus Page${suffix}`;
                response += `<br><a href='https://www.google.com/maps/search/?api=1&query=${location.position.lat},${location.position.lng}' target='_blank'>Google Maps${suffix}`;
            } 
            else if (matchedResponse.intent === INTENT.PHONE_NUMBER_INFO) {
                response = `<strong>${location.title}</strong> Contact Info:<br><br>`;
                response += `<i class='bx bxs-phone-call'></i>&nbsp;&nbsp;<a href='tel:${location.phone}'>${location.phone}</a><br>`;
                response += `<i class='bx bxs-envelope'></i>&nbsp;&nbsp;<a href="mailto:${location.email}">${location.email}</a>`;
                response += `<br><br><a href='https://www.ivytech.edu/${location.url}' target='_blank'>Campus Page${suffix}`;
            }
        } else {
            // No location specified, ask which campus
            if (matchedResponse.intent === INTENT.ADDRESS_INFO) {
                response = "Kaya kong hanapin iyon para sa iyo. Aling campus ang gusto mong address?";
            } else {
                response = "Kaya kong hanapin iyon para sa iyo. Aling campus ang gusto mong phone number?";
            }
        }
    }
    
    // For dean queries, append White Pages link
    else if (matchedResponse.intent === INTENT.DEAN_INFO) {
        const campusName = (deanLocIndex > -1) ? locations[deanLocIndex].title : '';
        response += `<br><a href='${buildWhitePagesURL('', '', campusName, 'faculty', 'Dean')}' target='_blank'>White Pages${suffix}`;
    }
    
    // For general resource URLs, append them
    else if (matchedResponse.url) {
        response += `<br><br><a href='${matchedResponse.url}' target='_blank'>${matchedResponse.link || 'More info'}${suffix}`;
    }

    return response;
}

// Build a Filipino-mode aware response for a matchedResponse
// This wwould use the "filipino_reply "
// mode: 'replace' | 'both' | 'append'
function handleFilipinoReply(matchedResponse, mode = 'replace', detectedIntent, opts = {}) {
    if (!matchedResponse) return { response: '', botFilipinoResponse: '' };
    const originalLocIndex = typeof opts.originalLocIndex === 'number' ? opts.originalLocIndex : -1;
    const deanLocIndex = typeof opts.deanLocIndex === 'number' ? opts.deanLocIndex : -1;
    const suffix = opts.suffix || "&nbsp;<i class='bx bx-link-external'></i></a>";

    let response = '';
    let botFilipinoResponse = '';

    if (mode === 'replace') {
        response = matchedResponse.filipino_reply || matchedResponse.reply || '';
        botFilipinoResponse = matchedResponse.reply ? `${matchedResponse.filipino_reply} | Translated: ${matchedResponse.reply}` : `${matchedResponse.filipino_reply}`;
    } else if (mode === 'both') {
        const first = matchedResponse.filipino_reply || matchedResponse.reply || '';
        const second = matchedResponse.reply || matchedResponse.filipino_reply || '';
        response = `${first} | Translated: ${second}`;
        botFilipinoResponse = response;
    } else { // append
        response = matchedResponse.reply || matchedResponse.filipino_reply || '';
        if (matchedResponse.filipino_reply) response += `<br><br>${matchedResponse.filipino_reply}`;
        botFilipinoResponse = response;
    }

    // Enhance with links (White Pages, campus pages, or URL)
    response = enhanceWithLinks(response, matchedResponse, { originalLocIndex, deanLocIndex, suffix });

    return { response, botFilipinoResponse };
}

module.exports = {
    isFilipino,
    translateFilipinoToEnglish,
    enhanceWithLinks,
    handleFilipinoReply,
    filipinoTranslations
};