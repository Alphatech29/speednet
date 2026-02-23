const axios = require("axios");
const { getWebSettings } = require("./general");
const { generateUniqueRandomNumber } = require("./random");
const { getUserDetailsByUid } = require("./userInfo");
const { createTransactionHistory } = require("../utility/history");

/**
 * Build secure wallet redirect URL
 * Always: {web_url}/user/wallet
 */
function buildWalletRedirectUrl(webUrl) {
  if (!webUrl) throw new Error("web_url missing in settings");

  // remove trailing slash if present
  const cleanUrl = webUrl.replace(/\/+$/, "");

  return `${cleanUrl}/user/wallet`;
}

/**
 * Convert USD to NGN
 */
function convertUsdToNaira(usdAmount, nairaRate) {
  if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) {
    throw new Error("Invalid USD amount supplied");
  }

  if (!nairaRate || isNaN(nairaRate)) {
    throw new Error("Invalid naira rate in settings");
  }

  const nairaAmount = Number(usdAmount) * Number(nairaRate);
  return Number(nairaAmount.toFixed(2));
}

/**
 * Get Monnify Access Token
 */
async function getMonnifyAccessToken() {
  try {
    const settings = await getWebSettings();

    const apiKey = settings.monnify_apiKey;
    const secretKey = settings.monnify_secretKey;
    const baseUrl = settings.monnify_baseUrl;

    if (!apiKey || !secretKey || !baseUrl) {
      throw new Error("Monnify configuration missing in web settings");
    }

    const encodedKeys = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    const response = await axios.post(
      `${baseUrl}/api/v1/auth/login`,
      {},
      {
        headers: {
          Authorization: `Basic ${encodedKeys}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.requestSuccessful) {
      throw new Error(response.data?.responseMessage || "Monnify auth failed");
    }

    const { accessToken } = response.data.responseBody;

    return { accessToken, baseUrl };
  } catch (error) {
    console.error(
      "Monnify Authentication Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Initialize Wallet Funding Transaction
 */
async function initializeMonnifyTransaction(payload) {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload");
    }

    /** ---------------- SETTINGS ---------------- */
    const settings = await getWebSettings();
    const { accessToken, baseUrl } = await getMonnifyAccessToken();

    const contractCode = settings?.monnify_contractCode;
    const nairaRate = Number(settings?.naira_rate);
    const redirectUrl = buildWalletRedirectUrl(settings?.web_url);

    if (!contractCode) throw new Error("Monnify contract code missing in settings");
    if (!nairaRate || isNaN(nairaRate)) throw new Error("Invalid naira rate");

    /** ---------------- VALIDATION ---------------- */
    if (!payload.user_id) throw new Error("User ID is required");

    const usdAmount = Number(payload.amount);
    if (!usdAmount || isNaN(usdAmount) || usdAmount <= 0) {
      throw new Error("Invalid amount supplied");
    }

    /** ---------------- USER ---------------- */
    const user = await getUserDetailsByUid(payload.user_id);
    if (!user) throw new Error("User not found");

    const customerName = user.full_name;
    const customerEmail = user.email;

    /** ---------------- CONVERSION ---------------- */
    const convertedAmount = convertUsdToNaira(usdAmount, nairaRate);

    /** ---------------- PAYMENT REF ---------------- */
    const paymentReference = `${generateUniqueRandomNumber(13)}`;

    console.log(
      `Funding Wallet | UID:${payload.user_id} | USD:${usdAmount} | RATE:${nairaRate} | NGN:${convertedAmount} | REF:${paymentReference}`
    );

    /** ---------------- MONNIFY INIT ---------------- */
    const response = await axios.post(
      `${baseUrl}/api/v1/merchant/transactions/init-transaction`,
      {
        amount: convertedAmount,
        customerName,
        customerEmail,
        paymentReference,
        paymentDescription: payload.paymentDescription || "Wallet funding",
        currencyCode: "NGN",
        contractCode,
        redirectUrl: redirectUrl,
        paymentMethods: ["CARD", "ACCOUNT_TRANSFER", "USSD"],
        metadata: {
          app: "web",
          uid: String(payload.user_id),
          originalUsdAmount: usdAmount,
          nairaRate: nairaRate,
          convertedAmount: convertedAmount,
          customReference: paymentReference,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    if (!response?.data?.requestSuccessful) {
      throw new Error(response?.data?.responseMessage || "Transaction init failed");
    }

    const data = response.data.responseBody;

    /** ---------------- CREATE PENDING TRANSACTION ---------------- */
    await createTransactionHistory(
      payload.user_id,
      usdAmount,
      "Wallet Deposit",
      "pending",
      paymentReference,
      data.transactionReference
    );

    /** ---------------- RESPONSE ---------------- */
    return {
      transactionReference: data.transactionReference,
      paymentReference: data.paymentReference,
      checkoutUrl: data.checkoutUrl,
      enabledPaymentMethod: data.enabledPaymentMethod,
      chargedAmountNGN: convertedAmount,
      originalUsdAmount: usdAmount,
      redirectUrl: redirectUrl,
    };
  } catch (error) {
    console.error(
      "Monnify Init Transaction Error:",
      error?.response?.data || error.message
    );

    throw new Error("Unable to initialize payment");
  }
}

module.exports = {
  initializeMonnifyTransaction,
};