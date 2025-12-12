const { LANGUAGE } = require('../data/database');

// Generic misunderstanding responses
const ENG_ERROR_STATEMENTS = [
    "Sorry, I didn't quite catch that. Could you try asking in a different way?",
    "I'm having trouble understanding. Would you mind rephrasing your question?",
    "I'm a bit confused by that one. Can you ask it another way, please?"
];

// Filipino error statements
const FIL_ERROR_STATEMENTS = [
    "Pasensya na, medyo hindi ko po gaanong naintindihan ang tanong. Maaari po ba ninyong ipaliwanag o itanong muli sa ibang paraan?",
    "Pasensya na, nahirapan po akong maintindihan ang tanong. Maaari po ba ninyong ulitin o linawin nang kaunti?",
    "Medyo nalito po ako sa tanong ninyo. Maaari po ba ninyong ipaliwanag ito sa ibang paraan?"
];

const FIL_COMMON_PATTERNS = [
    'ano', 'sino', 'saan', 'paano', 'anong', 'sinong', 'saang', 'paanong', 'kailan', 'kailangang',
    'po', 'opo', 'natanggap', 'matanggap', 'mga', 'salamat', 'tulong', 'presyo', 'libre', 'libreng', 'bayad', 'bukas', 'sarado', 'oras',
    'kumusta',
    'kurso', 'martikula', 'admisyon', 'pag enroll', 'pag-enroll', 'enroll', 'mag-enroll', 'mag enroll', 'mag-apply', 'mag apply', 'apply',
    'pag', 'mag', 'nag', 'namamahala', 'guro', 'titser', 'eskwela', 'paaralan', 'kolehiyo', 'punong-guro', 'panukalan',
    'kompyuter', 'teknolohiya', 'teknikal', 'siyensiya', 'agham', 'matematika', 'kamusta', 'hoy', 'oy', 'huy', 'uy', 'kamusta ka', 'kumusta ka',
    'asosado', 'dekano', 'kurikulum', 'pwede', 'puede'
];

const ENG_COMMON_PATTERNS = [
    'what', 'who', 'where', 'how', 'which', 'when', 'please', 'thank', 'help', 'price', 'free', 'open', 'close', 'hours',
    'course', 'tuition', 'admission', 'enroll', 'apply', 'school', 'college', 'principal', 'curriculum',
    'computer', 'technology', 'technical', 'science', 'math', 'hello', 'hi', 'hey'
];

function detectLanguage(text) {
    if (!text) return LANGUAGE.ENGLISH;

    const lowerText = text.toLowerCase();
    // Only match whole words to avoid false positives
    const fil = FIL_COMMON_PATTERNS.some(word => {
        const wordRegex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return wordRegex.test(lowerText);
    });

    const eng = ENG_COMMON_PATTERNS.some(word => {
        const wordRegex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return wordRegex.test(lowerText);
    });

    if (fil && !eng) return LANGUAGE.FILIPINO;
    return LANGUAGE.ENGLISH;
}

module.exports = {
    detectLanguage,
    ENG_COMMON_PATTERNS,
    FIL_COMMON_PATTERNS,
    ENG_ERROR_STATEMENTS,
    FIL_ERROR_STATEMENTS
};