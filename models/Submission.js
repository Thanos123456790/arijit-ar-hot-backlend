import mongoose from "mongoose";

const EvaluatedQuestion = new mongoose.Schema({
  question: String,
  correctAnswer: String,
  studentAnswer: String,
  score: Number,
  obtained: Number,
  teacherComment:String,
});

const SubmissionSchema = new mongoose.Schema(
  {
    testId:      { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
    studentId:   String,
    studentName: String,
    studentRoll: String,
    studentEmail:String,
    obtainedScore: Number,
    totalScore:   Number,
    percentage:   Number,
    evaluatedQuestions: [EvaluatedQuestion],
    submittedAt: { type: Date, default: Date.now },
    status:{type: String, enum: ["waiting", "pass", "fail"]},
    timeLeft:Number,
  },
  { timestamps: true,
    strict: true,
  }
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
