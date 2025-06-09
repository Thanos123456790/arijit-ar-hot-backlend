import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: String,
  type: String,
  options: [String],
  correctAnswer: String,
  score: Number,
});

const TestSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  name:       String,
  duration:   String,
  evaluationType: { type: String, enum: ["Manual","AI","Automated"] },
  totalScore: Number,
  questions:  [QuestionSchema],
  assignedTo: { type: [String], default: [] }, 
  studentsAttempted: { type:Number, default:0 },
}, { timestamps:true });


export const Test = mongoose.model('Test', TestSchema);
