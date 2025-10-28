const fuzz = require('fuzzball');
const filipinoTranslations = require('../data/filipino_translation_inquires.json');

// Simple Filipino language detection (checks for common Filipino words)
function isFilipino(text) {
    const filipinoKeywords = [
        'ano', 'sino', 'saan', 'paano', 'anong', 'sinong', 'saang', 'paanong', 'kailan', 'kailangang',
        'po', 'opo', 'natanggap', 'matanggap', 'mga', 'salamat', 'tulong', 'presyo', 'libre', 'libreng', 'bayad', 'bukas', 'sarado', 'oras',
        'kurso', 'martikula', 'admisyon', 'pag enroll', 'pag-enroll', 'enroll', 'mag-enroll', 'mag enroll', 'mag-apply', 'mag apply', 'apply',
        'pag', 'mag', 'nag', 'namamahala', 'guro', 'titser', 'eskwela', 'paaralan', 'kolehiyo', 'punong-guro', 'panukalan', 
        'kompyuter', 'teknolohiya', 'teknikal', 'siyensiya', 'agham', 'matematika', 'kamusta', 'hoy', 'oy', 'huy', 'uy', 'kamusta ka', 'kumusta ka',
        'asosado', 'dekano', 'kurikulum', 
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

    filipinoTranslations.forEach(pair => {
        const filipinoVariants = Array.isArray(pair.filipino) ? pair.filipino : [pair.filipino];
        filipinoVariants.forEach(variant => {
            const score = fuzz.token_set_ratio(variant.toLowerCase(), prompt.toLowerCase());
            if (score > bestScore && score > 75) { 
                bestScore = score;
                bestMatch = pair;
            }
        });
    });
    if (bestMatch) {
        // If english is array, return first variant
        if (Array.isArray(bestMatch.english)) {
            return bestMatch.english[0];
        }
        return bestMatch.english;
    }
    return prompt;
}

module.exports = {
    isFilipino,
    translateFilipinoToEnglish
};