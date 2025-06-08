import { Submission } from '../models/Submission.js';
import { Test } from "../models/Test.js";

export const submitTest = async (req, res) => {
  const sub = new Submission(req.body);
  await sub.save();
  res.status(201).json({ message: 'Test submitted' });
};

export const getResults = async (req, res) => {
  const results = await Submission.find({ testId: req.params.testId });
  res.json(results);
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

