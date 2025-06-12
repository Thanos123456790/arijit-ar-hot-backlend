import nodemailer from "nodemailer";
import moment from "moment-timezone";
import { Submission } from "../models/Submission.js";
import { Test } from "../models/Test.js";
import { encrypt, decrypt } from "../utils/encryptUtils.js";
import dotenv from "dotenv";
import { sendTestEmail } from "../utils/emailUtils.js";


// ✅ Helper to parse and convert separate date and time strings to IST Date object
const toISTDateTime = (dateStr, timeStr) =>
  moment.tz(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata").toDate();


// create test -------------->>>
export const createTest = async (req, res) => {
  try {
    const { startDate, startTime, expiryDate, expiryTime, questions, ...rest } = req.body;

    const startIST = toISTDateTime(startDate, startTime);
    const expiryIST = toISTDateTime(expiryDate, expiryTime);

    if (startIST > expiryIST) {
      return res.status(400).json({ msg: "Start date cannot be after expiry date" });
    }

    const encryptedQuestions = encrypt(questions);

    const test = await Test.create({
      ...rest,
      startDate: startIST,
      expiryDate: expiryIST,
      questions: encryptedQuestions,
    });

    res.status(201).json({ ...test.toObject(), questions });
  } catch (err) {
    res.status(500).json({ msg: "Error creating test", error: err.message });
  }
};


// ✅ GET ALL TESTS
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    const decryptedTests = tests.map((test) => {
      const t = test.toObject();
      t.questions = decrypt(t.questions);
      return t;
    });
    res.json(decryptedTests);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tests", error: err.message });
  }
};

// ✅ GET TEACHER TESTS
export const getTeacherTests = async (req, res) => {
  try {
    const tests = await Test.find({ teacherId: req.query.teacherId });
    const decryptedTests = tests.map((test) => {
      const t = test.toObject();
      t.questions = decrypt(t.questions);
      return t;
    });
    res.json(decryptedTests);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching teacher tests", error: err.message });
  }
};

// ✅ UPDATE TEST
export const updateTest = async (req, res) => {
  try {
    const { startDate, startTime, expiryTime, expiryDate, questions, ...rest } = req.body;
    const updateData = { ...rest };

    if (startDate && expiryDate) {
      const startIST = toISTDate(startDate,startTime);
      const expiryIST = toISTDate(expiryDate,expiryTime);

      if (startIST > expiryIST) {
        return res.status(400).json({ msg: "Start date cannot be after expiry date" });
      }

      updateData.startDate = startIST;
      updateData.expiryDate = expiryIST;
    }

    if (questions) {
      updateData.questions = encrypt(questions);
    }

    const test = await Test.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!test) return res.status(404).json({ msg: "Test not found" });

    const t = test.toObject();
    t.questions = decrypt(t.questions);
    res.json(t);
  } catch (err) {
    res.status(500).json({ msg: "Error updating test", error: err.message });
  }
};

// ✅ ASsign test
export const assignTest = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ msg: "No emails provided" });
    }

    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedTo: { $each: emails } } },
      { new: true }
    );

    if (!test) return res.status(404).json({ msg: "Test not found" });

    // Send email to all
    for (let email of emails) {
      await sendTestEmail({
        email,
        test,
        messageText: "You have been assigned a new test. Please find the details below.",
        showCalendar: true,
      });
    }

    res.json({ msg: "Test assigned and emails sent successfully.", test });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error assigning test", error: err.message });
  }
};


// ✅ DELETE TEST
export const deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ msg: "Error deleting test", error: err.message });
  }
};

// ✅ GET TEST BY ID
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ msg: "Test not found" });

    const t = test.toObject();
    t.questions = decrypt(t.questions);
    res.json(t);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching test", error: err.message });
  }
};

// ✅ SUBMIT TEST
export const submitTest = async (req, res) => {
  try {
    const { studentId, studentName, answers } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ msg: "Test not found" });

    const decryptedQuestions = decrypt(test.questions);

    let obtainedScore = 0;
    const evaluated = decryptedQuestions.map((q, idx) => {
      const studentAnswer = answers[idx];
      let earned = 0;

      if (["Multiple Choice", "True/False"].includes(q.type)) {
        if (studentAnswer === q.correctAnswer) earned = q.score;
      } else if (q.type === "Short Answer") {
        earned = studentAnswer?.trim() ? Math.floor(q.score / 2) : 0;
      }

      obtainedScore += earned;

      return {
        question: q.question,
        correctAnswer: q.correctAnswer,
        studentAnswer: studentAnswer || "",
        score: q.score,
        obtained: earned,
      };
    });

    const percentage =
      test.totalScore > 0
        ? Math.round((obtainedScore / test.totalScore) * 100)
        : 0;

    const submission = await Submission.create({
      testId: test._id,
      studentId,
      studentName,
      obtainedScore,
      totalScore: test.totalScore,
      percentage,
      evaluatedQuestions: evaluated,
    });

    test.studentsAttempted += 1;
    await test.save();

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ msg: "Error submitting test", error: err.message });
  }
};
