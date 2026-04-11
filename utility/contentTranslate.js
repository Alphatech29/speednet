const axios = require("axios");

// Returns true if text contains Cyrillic characters (worth translating)
function hasCyrillic(text) {
  return /[\u0400-\u04FF]/.test(text);
}

async function translateRussianToEnglish(text) {
  if (!text || !hasCyrillic(text)) return text; // nothing to translate

  try {
    const response = await axios.get("https://translate.googleapis.com/translate_a/single", {
      params: {
        client: "gtx",
        sl: "auto",
        tl: "en",
        dt: "t",
        q: text,
      },
      timeout: 8000,
    });

    const translated = response.data[0]
      .filter((item) => item && item[0])
      .map((item) => item[0])
      .join("");

    return translated || text;
  } catch (error) {
    console.error("Translation error:", error.message);
    return text; // return original instead of null so content is never lost
  }
}

module.exports = { translateRussianToEnglish };
