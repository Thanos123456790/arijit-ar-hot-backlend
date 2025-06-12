import cron from "node-cron";
import moment from "moment-timezone";
import { Test } from "../models/Test.js";
import { sendTestEmail } from "../utils/emailUtils.js";

export const scheduleTestNotifications = () => {
    // Runs every 5 minutes
    cron.schedule("*/5 * * * *", async () => {
        try {
            const now = moment().tz("Asia/Kolkata");

            const tests = await Test.find({ assignedTo: { $exists: true, $ne: [] } });

            for (const test of tests) {
                const expiry = moment(test.expiryDate).tz("Asia/Kolkata");
                const diffInMinutes = expiry.diff(now, "minutes");

                // Email 2 hours before test ends
                if (diffInMinutes <= 120 && diffInMinutes > 115 && !test.notifiedTwoHoursBefore) {
                    for (const email of test.assignedTo) {
                        await sendTestEmail({
                            email,
                            test,
                            messageText: "⏰ Just a reminder! Your test is ending in 2 hours. Make sure to submit it before time.",
                            showCalendar: false,
                        });
                    }
                    test.notifiedTwoHoursBefore = true;
                    await test.save();
                }

                // Email after test ends
                if (diffInMinutes <= 0 && !test.notifiedEnd) {
                    for (const email of test.assignedTo) {
                        await sendTestEmail({
                            email,
                            test,
                            messageText: "🚫 The test has ended. Thank you for participating.",
                            showCalendar: false,
                        });
                    }
                    test.notifiedEnd = true;
                    await test.save();
                }
            }
        } catch (error) {
            console.error("Error running scheduled notifications:", error);
        }
    });
};
