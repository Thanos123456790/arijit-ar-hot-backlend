import CheatingLog from '../models/CheatingLog.js';
export const getCheatingLogs = async (req, res) => {
  const { testId } = req.params;
  const logs = await CheatingLog.find({ testId }).sort({ timestamp: -1 });
  res.json(logs);
};