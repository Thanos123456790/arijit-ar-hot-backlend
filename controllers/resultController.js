import Submission from '../models/Submission.js';

export const submitTest = async (req, res) => {
  const sub = new Submission(req.body);
  await sub.save();
  res.status(201).json({ message: 'Test submitted' });
};

export const getResults = async (req, res) => {
  const results = await Submission.find({ testId: req.params.testId });
  res.json(results);
};
