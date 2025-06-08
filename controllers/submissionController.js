import { Submission } from "../models/Submission.js";

export const getStudentSubmission = async (req, res) => {
    const { testId, studentId } = req.query;
    if (!testId || !studentId)
        return res.status(400).json({ msg: "testId & studentId required" });

    const sub = await Submission.findOne({ testId, studentId });
    if (!sub) return res.status(404).json({ msg: "Submission not found" });
    res.json(sub);
};
