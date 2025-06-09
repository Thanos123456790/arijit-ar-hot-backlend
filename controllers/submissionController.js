import { Submission } from "../models/Submission.js";

export const getStudentSubmission = async (req, res) => {
    const { testId, studentId } = req.query;
    if (!testId || !studentId)
        return res.status(400).json({ msg: "testId & studentId required" });

    const sub = await Submission.findOne({ testId, studentId });
    if (!sub) return res.status(404).json({ msg: "Submission not found" });
    res.json(sub);
};

export const getSubmissionsByTest = async (req, res) => {
    const { testId } = req.params;
    const subs = await Submission.find({ testId }).lean();
    res.json(subs);
};

export const updateSubmission = async (req, res) => {
    const { id } = req.params;
    const { questions } = req.body;   // [{ idx, teacherScore, teacherComment }]
    try {
        const sub = await Submission.findById(id);
        questions.forEach(({ idx, teacherScore, teacherComment }) => {
            if (sub.evaluatedQuestions[idx]) {
                sub.evaluatedQuestions[idx].teacherScore = teacherScore;
                sub.evaluatedQuestions[idx].teacherComment = teacherComment;
            }
        });
        await sub.save();
        res.json({ msg: "Saved", submission: sub });
    } catch (err) {
        res.status(500).json({ msg: "Update failed", error: err.message });
    }
};
