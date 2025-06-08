import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    testId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: String,
    commentText: String,
    createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model('Comment', CommentSchema);
