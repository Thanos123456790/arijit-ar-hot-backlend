import User from '../models/User.js';
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(updated);
};