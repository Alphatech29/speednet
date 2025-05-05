const { getWebSettings } = require("../utility/general");
const generateHash = require("../utility/generateHash");
const { generateUniqueRandomNumber } = require("../utility/generateUniqueRandomNumber");
const axios = require('axios');

/**
 * ✅ Generate authentication headers (with hash)
 */
const getAuthHeaders = (payload, settings) => {
    const { vtpass_api_key, vtpass_pk, vtpass_sk } = settings;

    const hash = generateHash(payload, vtpass_sk);

    return {
        "api-key": vtpass_api_key,
        "public-key": vtpass_pk,
        "hash": hash,
        "Content-Type": "application/json",
    };
};

/**
 * ✅ Check VTpass Wallet Balance
 */
exports.checkVtuBalance = async () => {
    try {
        const settingsArray = await getWebSettings();

        if (!settingsArray || !Array.isArray(settingsArray) || settingsArray.length === 0) {
            throw new Error("VTU settings are missing.");
        }

        const settings = settingsArray[0];

        if (!settings.vtpass_url || typeof settings.vtpass_url !== "string") {
            throw new Error(`Invalid VTU API base URL: ${JSON.stringify(settings.vtpass_url)}`);
        }

        const headers = getAuthHeaders({}, settings);
        const apiUrl = `${settings.vtpass_url}/api/balance`;

        const result = await axios.get(apiUrl, { headers });

        if (result.data.code === 1) {
            const balance = parseFloat(result.data.contents.balance);
            return { success: true, balance };
        }

        return { success: false, error: result.data.response_description || "Failed to fetch balance" };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * ✅ Direct Airtime Recharge
 */
exports.rechargeAirtime = async (amount, type, phone) => {
    try {
        const balanceCheck = await exports.checkVtuBalance();

        if (!balanceCheck.success || balanceCheck.balance < amount) {
            throw new Error("Insufficient VTU balance.");
        }

        const settingsArray = await getWebSettings();
        if (!settingsArray || settingsArray.length === 0) {
            throw new Error("VTU settings are missing.");
        }

        const settings = settingsArray[0];
        const url = `${settings.vtpass_url}/api/pay`;

        const payload = {
            serviceID: type,
            request_id: generateUniqueRandomNumber(),  // Using generateUniqueRandomNumber for unique request ID
            amount,
            phone,
        };

        const headers = getAuthHeaders(payload, settings);
        const result = await axios.post(url, payload, { headers });

        if (result.data.code === "000") {
            return { success: true, message: "Airtime recharge successful", data: result.data };
        }

        return { success: false, error: result.data.response_description || "Recharge failed" };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
