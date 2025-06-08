import mongoose from 'mongoose';
const cheatingLogSchema = new mongoose.Schema({
  studentId: String,
  testId: String,
  event: String,
  timestamp: { type: Date, default: Date.now },
});
export default mongoose.model('CheatingLog', cheatingLogSchema);