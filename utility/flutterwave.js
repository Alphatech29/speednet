const axios = require("axios");
const { getWebSettings } = require("./general");
const { generateUniqueRandomNumber } = require("./random");
const { getUserDetailsByUid } = require("./userInfo");
const { createTransactionHistory } = require("./history");
const monitor = require("./monitor");

const FLW_BASE_URL = "https://api.flutterwave.com/v3";

/**
 * Build secure wallet redirect URL
 * Always: {web_url}/user/wallet
 */
function buildWalletRedirectUrl(webUrl) {
  if (!webUrl) throw new Error("web_url missing in settings");
  return `${webUrl.replace(/\/+$/, "")}/user/wallet`;
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
  return Number((Number(usdAmount) * Number(nairaRate)).toFixed(2));
}

/**
 * Initialize Wallet Funding Transaction via Flutterwave
 */
async function initializeFlutterwaveTransaction(payload) {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload");
    }

    /** ---------------- SETTINGS ---------------- */
    const settings = await getWebSettings();

    const secretKey = settings?.flw_secret_key;
    const publicKey = settings?.flw_public_key;
    const nairaRate = Number(settings?.naira_rate);
    const redirectUrl = buildWalletRedirectUrl(settings?.web_url);

    if (!secretKey) throw new Error("Flutterwave secret key missing in settings");
    if (!publicKey) throw new Error("Flutterwave public key missing in settings");
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

    /** ---------------- CONVERSION ---------------- */
    const convertedAmount = convertUsdToNaira(usdAmount, nairaRate);

    /** ---------------- PAYMENT REF ---------------- */
    const tx_ref = `${generateUniqueRandomNumber(13)}`;

    console.log(
      `Funding Wallet | UID:${payload.user_id} | USD:${usdAmount} | RATE:${nairaRate} | NGN:${convertedAmount} | REF:${tx_ref}`
    );

    /** ---------------- FLUTTERWAVE INIT ---------------- */
    const response = await axios.post(
      `${FLW_BASE_URL}/payments`,
      {
        tx_ref,
        amount: convertedAmount,
        currency: "NGN",
        redirect_url: redirectUrl,
        payment_options: "card,banktransfer,ussd",
        customer: {
          email: user.email,
          name: user.full_name,
        },
        meta: {
          app: "web",
          uid: String(payload.user_id),
          originalUsdAmount: usdAmount,
          nairaRate,
          convertedAmount,
        },
        customizations: {
          title: payload.paymentDescription || "Wallet Funding",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    if (response?.data?.status !== "success") {
      throw new Error(response?.data?.message || "Transaction init failed");
    }

    const checkoutUrl = response.data.data?.link;
    if (!checkoutUrl) throw new Error("No checkout link returned by Flutterwave");

    /** ---------------- CREATE PENDING TRANSACTION ---------------- */
    await createTransactionHistory(
      payload.user_id,
      usdAmount,
      "Wallet Deposit",
      "pending",
      tx_ref,
      tx_ref
    );

    monitor.info("Flutterwave payment initialized", { user_id: payload.user_id, usdAmount, tx_ref });
    /** ---------------- RESPONSE ---------------- */
    return {
      transactionReference: tx_ref,
      paymentReference: tx_ref,
      checkoutUrl,
      publicKey,
      chargedAmountNGN: convertedAmount,
      originalUsdAmount: usdAmount,
      redirectUrl,
    };
  } catch (error) {
    monitor.error("Flutterwave payment initialization failed", { stack: error.stack, message: error.message, user_id: payload?.user_id });
    console.error(
      "Flutterwave Init Transaction Error:",
      error?.response?.data || error.message
    );
    throw new Error("Unable to initialize payment");
  }
}

module.exports = {
  initializeFlutterwaveTransaction,
};
