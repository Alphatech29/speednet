// smsTimeEngine.js
const { updateSmsServiceRecord, getSmsServiceRecord, createTransactionHistory } = require("./history");
const { getUserDetailsByUid, updateUserBalance } = require("./userInfo");

// Map to track active countdowns: { tzid: intervalId }
const activeCountdowns = new Map();

async function refundUser(userId, amount) {
  try {
    if (!userId || amount === undefined || isNaN(amount)) {
      console.error(" Invalid parameters for refundUser:", { userId, amount });
      return;
    }

    const user = await getUserDetailsByUid(userId);
    if (!user) {
      console.warn(`⚠️ User not found for refund: userId=${userId}`);
      return;
    }

    // Ensure numeric addition
    const newBalance = Number(user.account_balance) + Number(amount);

    // Correct call: pass both parameters explicitly
    await updateUserBalance(userId, newBalance);

    await createTransactionHistory(
      userId,
      Number(amount),
      "Refund for Unused SMS service",
      "completed"
    );

    console.log(` Refunded ${Number(amount)} to userId=${userId}, new balance=${newBalance}`);
  } catch (err) {
    console.error(` Failed to refund userId=${userId}:`, err.message);
  }
}

function startSmsCountdown(time, tzid) {
  if (activeCountdowns.has(tzid)) {
    console.log(` Countdown for tzid=${tzid} is already running, skipping`);
    return;
  }

  let remaining = Number(time);
  console.log(`▶ Countdown started for tzid: ${tzid}, initial time: ${remaining}s`);

  const interval = setInterval(async () => {
    if (remaining <= 0) {
      clearInterval(interval);
      activeCountdowns.delete(tzid);
      console.log(` Countdown expired for tzid: ${tzid}`);

      try {
        const record = await getSmsServiceRecord(tzid);
        const code = record?.code || null;

        if (!code) {
          console.log(` No code found for tzid: ${tzid}, setting status = 2`);
          await updateSmsServiceRecord(tzid, null, 2);

          if (record?.user_id && record?.amount) {
            // Refund with numeric safety
            await refundUser(record.user_id, Number(record.amount));
          }
        }
      } catch (err) {
        console.error(` Failed to handle expiry for tzid: ${tzid}`, err.message);
      }
    } else {
      const minutes = Math.floor(remaining / 60);
      const secs = remaining % 60;
      console.log(` tzid ${tzid} => ${minutes}m ${secs}s remaining`);
      remaining -= 1;
    }
  }, 1000);

  activeCountdowns.set(tzid, interval);
}

function stopSmsCountdown(tzid) {
  if (activeCountdowns.has(tzid)) {
    clearInterval(activeCountdowns.get(tzid));
    activeCountdowns.delete(tzid);
    console.log(` Countdown manually stopped for tzid=${tzid}`);
  }
}

module.exports = {
  startSmsCountdown,
  stopSmsCountdown
};
