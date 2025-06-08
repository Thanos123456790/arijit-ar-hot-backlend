import { Test } from '../models/Test.js';
import { Comment } from '../models/Comment.js';

export const getTests = async (req, res) => {
  const tests = await Test.find();
  res.json(tests);
};

export const getTeacherTests = async (req,res)=>{
  const tests = await Test.find({ teacherId: req.query.teacherId });
  res.json(tests);
};

export const postComment = async (req, res) => {
  const { testId, userId, userName, commentText } = req.body;
  const comment = await Comment.create({ testId, userId, userName, commentText });
  res.status(201).json(comment);
};

export const createTest = async (req,res)=>{
  const test = await Test.create(req.body);
  res.status(201).json(test);
};

export const updateTest = async (req,res)=>{
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(test);
};

export const assignTest = async (req,res)=>{
  const { branch, semester } = req.body;
  const test = await Test.findByIdAndUpdate(
    req.params.id,
    { $push:{ assignedTo:{ branch, semester } } },
    { new:true }
  );
  res.json(test);
};

export const deleteTest = async (req,res)=>{
  await Test.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

