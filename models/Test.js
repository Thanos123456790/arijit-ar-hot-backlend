import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  name: String,
  duration: String,
  evaluationType: { type: String, enum: ["Manual", "AI", "Automated"] },
  totalScore: Number,
  questions: { type: String, required: true }, // Changed to String for encryption
  assignedTo: { type: [String], default: [] },
  studentsAttempted: { type: Number, default: 0 },
}, { timestamps: true });



export const Test = mongoose.model('Test', TestSchema);
