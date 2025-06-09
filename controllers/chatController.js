import { ChatMessage } from "../models/ChatMessage.js";

export const getMessages = async (req, res) => {
    const { department, semester, since } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (since) filter.createdAt = { $gt: new Date(since) };

    const msgs = await ChatMessage.find(filter).sort({ createdAt: 1 }).lean();
    res.json(msgs);
};

export const postMessage = async (req, res) => {
    try {
        const msg = await ChatMessage.create(req.body);
        res.status(201).json(msg);
    } catch (err) {
        res.status(400).json({ msg: "Invalid message", error: err.message });
    }
};
