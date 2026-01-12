const axios = require("axios");

async function translateRussianToEnglish(text) {
  try {
    const url = "https://translate.googleapis.com/translate_a/single";

    const response = await axios.get(url, {
      params: {
        client: "gtx",
        sl: "ru",
        tl: "en",
        dt: "t",
        q: text
      }
    });

    // Google returns a deeply nested array
    const translatedText = response.data[0]
      .map(item => item[0])
      .join("");

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error.message);
    return null;
  }
}

module.exports = { translateRussianToEnglish };
