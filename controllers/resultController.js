import { Submission } from '../models/Submission.js';
import { Test } from "../models/Test.js";
import { User } from "../models/User.js";
import { sendTestEmail } from "../utils/emailUtils.js";

export const getResults = async (req, res) => {
  const results = await Submission.find({ testId: req.params.testId });
  res.json(results);
};


export const updateSubmissionStatuses = async (req, res) => {
  try {
    const { testId, statusMap, emails } = req.body;
    console.log(req.body);

    if (!testId || typeof statusMap !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const studentIds = Object.keys(statusMap);

    const bulkOps = studentIds.map((studentId) => ({
      updateOne: {
        filter: { testId, studentId },
        update: { $set: { status: statusMap[studentId].toLowerCase() } },
      },
    }));

    if (bulkOps.length === 0) {
      return res.status(400).json({ error: "No statuses to update" });
    }

    await Submission.bulkWrite(bulkOps);

    // Send emails only if `emails` array is provided
    if (Array.isArray(emails) && emails.length > 0) {
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Fetch student users by email
      const students = await User.find({ email: { $in: emails } });

      for (const student of students) {
        const studentId = student._id.toString();
        const status = statusMap[studentId];

        if (status === "Waiting") continue; // Skip waiting

        const messageText =
          status === "Pass"
            ? `🎉 Congratulations! You have passed the test "${test.name}". Great job!`
            : `😔 Unfortunately, you did not pass the test "${test.name}". Don't be discouraged—keep working hard and try again!`;

        // Send the email
        await sendTestEmail({
          email: student.email,
          test,
          messageText,
          showCalendar: false, // Disable calendar link for result mails
        });
      }
    }

    res.json({ message: "Statuses updated and emails sent successfully" });
  } catch (err) {
    console.error("Error updating statuses:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getTestResultsForTeacher = async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId).lean();
  if (!test) return res.status(404).json({ msg: "Test not found" });

  const subs = await Submission.find({ testId }).lean();
  if (!subs.length) return res.status(404).json({ msg: "No submissions yet" });

  res.json({
    testId,
    testName: test.name,
    totalScore: test.totalScore,
    date: subs[0].submittedAt,
    students: subs.map((s) => ({
      name: s.studentName,
      obtainedScore: s.obtainedScore,
      percentage: s.percentage,
      evaluatedQuestions: s.evaluatedQuestions,
    })),
  });
};

