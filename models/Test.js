import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  name: String,
  duration: String,
  evaluationType: { type: String, enum: ["Manual", "AI", "Automated"] },
  totalScore: Number,
  questions: { type: String, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  assignedTo: { type: [String], default: [] },
  studentsAttempted: { type: Number, default: 0 },
  notifiedTwoHoursBefore: { type: Boolean, default: false },
  notifiedEnd: { type: Boolean, default: false },
}, { timestamps: true });

export const Test = mongoose.model("Test", TestSchema);
