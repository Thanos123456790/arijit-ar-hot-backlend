import { Comment } from "../models/Comment.js";


export const postComment = async (req, res) => {
  const { testId, userId, userName, commentText } = req.body;
  const comment = await Comment.create({ testId, userId, userName, commentText });
  res.status(201).json(comment);
};

export const getCommentsByTest = async (req, res) => {
  const { testId } = req.params;
  const comments = await Comment.find({ testId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(comments);
};
