import { Submission } from "../models/Submission.js";
import { Test } from '../models/Test.js';

export const getTests = async (req, res) => {
  const tests = await Test.find();
  res.json(tests);
};

export const getTeacherTests = async (req,res)=>{
  const tests = await Test.find({ teacherId: req.query.teacherId });
  res.json(tests);
};

export const createTest = async (req,res)=>{
  const test = await Test.create(req.body);
  res.status(201).json(test);
};

export const updateTest = async (req,res)=>{
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(test);
};

export const assignTest = async (req, res) => {
  const { emails } = req.body;

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ msg: "No e-mails provided" });
  }

  const test = await Test.findByIdAndUpdate(
    req.params.id,
    // $addToSet --> no duplicates; $each lets us send an array
    { $addToSet: { assignedTo: { $each: emails } } },
    { new: true }
  );

  if (!test) return res.status(404).json({ msg: "Test not found" });
  res.json(test);
};


export const deleteTest = async (req,res)=>{
  await Test.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

/* GET /api/tests/:id  ─────────────── */
export const getTestById = async (req, res) => {
  // console.log("fetching id",req.params.id);
  const test = await Test.findById(req.params.id);
  if (!test) return res.status(404).json({ msg: "Test not found" });
  // console.log(test);
  res.json(test);
};

/* POST /api/tests/:id/submit ──────── */
export const submitTest = async (req, res) => {
  const { studentId, studentName, answers } = req.body;
  const test = await Test.findById(req.params.id);

  if (!test) return res.status(404).json({ msg: "Test not found" });

  let obtainedScore = 0;

  const evaluated = test.questions.map((q, idx) => {
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

  const totalScore = test.totalScore;
  const percentage =
    totalScore > 0 ? Math.round((obtainedScore / totalScore) * 100) : 0;

  const submission = await Submission.create({
    testId: test._id,
    studentId,
    studentName,
    obtainedScore,
    totalScore,
    percentage,
    evaluatedQuestions: evaluated,
  });

  // increment attempted counter
  test.studentsAttempted += 1;
  await test.save();

  res.status(201).json(submission);
};

