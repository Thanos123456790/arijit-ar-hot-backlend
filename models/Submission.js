import mongoose from 'mongoose';
const submissionSchema = new mongoose.Schema({
  testId: String,
  testName: String,
  student: Object,
  obtainedScore: Number,
  totalScore: Number,
  percentage: Number,
  questions: [
    {
      question: String,
      correctAnswer: String,
      studentAnswer: String,
      score: Number,
      obtained: Number,
      teacherScore: Number,
      teacherComment: String
    }
  ],
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Submission', submissionSchema);