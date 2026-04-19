// smsEngine.js
const cron = require("node-cron");
const { updateSmsServiceRecord, getPendingSmsServiceRecords } = require("./history");
const { getState } = require("./smsActivate");
const monitor = require("./monitor");

/**
 * Poll SMS states using cron
 */
async function checkSmsStates() {
  try {
    console.log("Cron job running: Checking SMS states...");

    // 🔹 Fetch records with status = 0
    const pending = await getPendingSmsServiceRecords();

    if (!pending.success || !pending.data.length) {
      console.log("No pending records found.");
      return;
    }

    for (const record of pending.data) {
      const { tzid } = record;

      const state = await getState(tzid);
      console.log(`Fetched state for tzid ${tzid}:`, state);

      if (state?.msg) {
        // Extract code from message
        const codeMatch = state.msg.match(/\d{4,8}/);
        const finalCode = codeMatch ? codeMatch[0] : null;
        const status = finalCode ? 1 : 0;

        await updateSmsServiceRecord(tzid, finalCode, status);
        if (finalCode) {
          monitor.success("SMS code received via cron poll", { tzid, code: finalCode });
        }
        console.log(`Updated record for tzid ${tzid} with code: ${finalCode}`);
      }
    }
  } catch (err) {
    monitor.error("SMS engine cron job crashed", { stack: err.stack, message: err.message });
    console.error("Error in cron job:", err);
  }
}

// 🔹 Run every second (6 fields: second minute hour day month weekday)
//cron.schedule("* * * * * *", checkSmsStates);

module.exports = { checkSmsStates };
