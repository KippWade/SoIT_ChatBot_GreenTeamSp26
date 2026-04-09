/**
 * Utility for building helpful suggestions HTML list for chatbot responses.
 *
 * @param {Array<string>} suggestionsArr - Array of suggestion strings.
 * @param {string} language - Language code (e.g., 'fil' for Filipino, 'en' for English).
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

module.exports = { buildHelpfulSuggestionsList };