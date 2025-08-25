const crypto = require("crypto");

/**
 * Generate VTpass HMAC-SHA1 hash
 * @param {Object} payload
 * @param {string} secretKey
 * @returns {string}
 */
const generateHash = (payload, secretKey) => {
    const bodyString = JSON.stringify(payload);
    return crypto
        .createHmac("sha1", secretKey)
        .update(bodyString)
        .digest("hex");
};

module.exports = generateHash;
