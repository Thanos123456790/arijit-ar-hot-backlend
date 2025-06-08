import mongoose from "mongoose";

const cheatingLogSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    testId:    { type: String, required: true },
    event:     { type: String, required: true }, // "tab-switch" | "fullscreen-exit" | "camera-off"
  },
  { timestamps: true }
);

export const CheatingLog = mongoose.model("CheatingLog", cheatingLogSchema);
