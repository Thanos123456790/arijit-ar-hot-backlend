import { CheatingLog } from "../models/CheatingLog.js";

export const logCheatingEvent = async (req, res) => {
  const { studentId, testId, event } = req.body;
  try {
    await CheatingLog.create({ studentId, testId, event });
    res.status(201).json({ msg: "Cheating event logged" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to log event", error: err.message });
  }
};

export const getCheatingLogsByTest = async (req, res) => {
  const { testId } = req.params;
  try {
    const logs = await CheatingLog.find({ testId }).sort({ createdAt: -1 }).lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch logs", error: err.message });
  }
}
