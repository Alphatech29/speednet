const cron = require("node-cron");

const startjob = (task, cronTime = "0 0 * * *", timezone = "Africa/Lagos") => {
  if (typeof task !== "function") {
    throw new Error("startjob requires a task function");
  }

  return cron.schedule(
    cronTime,
    async () => {
      try {
        console.log("[JOB] Started");

        await task();

        console.log("[JOB] Completed");
      } catch (error) {
        console.error("[JOB] Failed:", error);
      }
    },
    {
      scheduled: true,
      timezone,
    }
  );
};

module.exports = { startjob };
