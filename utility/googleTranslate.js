require('dotenv').config();
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate();

const translateText = async (req, res) => {
  try {
    let { texts } = req.body;

    if (!texts) {
      return res.status(400).json({ error: 'Please provide text(s) to translate' });
    }

    // Ensure texts is always an array
    if (!Array.isArray(texts)) texts = [texts];

    const results = [];

    for (let text of texts) {
      // Detect language
      const detected = await translate.detect(text);
      const lang = Array.isArray(detected) ? detected[0].language : detected.language;

      let translatedText = text;

      // Only translate if detected language is Russian
      if (lang === 'ru') {
        const translation = await translate.translate(text, 'en');
        translatedText = Array.isArray(translation) ? translation[0] : translation;
      }

      results.push({
        original: text,
        detectedLanguage: lang,
        translated: translatedText,
        targetLanguage: 'en',
      });
    }

    return res.status(200).json({
      results: texts.length === 1 ? results[0] : results,
    });

  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      details: error.message,
    });
  }
};

module.exports = { translateText };
