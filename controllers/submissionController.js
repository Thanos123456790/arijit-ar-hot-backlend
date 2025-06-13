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
    const { questions = [] } = req.body;
    // console.log(id + "data", questions);

    try {
        const sub = await Submission.findById(id);
        if (!sub) return res.status(404).json({ msg: "Submission not found" });

        /* validate & update each question */
        questions.forEach(({ idx, teacherScore = 0, teacherComment = "" }) => {
            const q = sub.evaluatedQuestions[idx];
            if (!q) return;                                   // skip bad idx
            if (teacherScore > q.score || teacherScore < 0)
                throw new Error(`Score out of range for question ${idx + 1}`);

            q.obtained = teacherScore;
            q.teacherComment = teacherComment;
        });

        /* recalc totals */
        sub.obtainedScore = sub.evaluatedQuestions.reduce(
            (sum, q) => sum + (q.obtained ?? 0), 0
        );
        sub.percentage = ((sub.obtainedScore / sub.totalScore) * 100).toFixed(2);

        await sub.save();
        res.json({ msg: "Saved", submission: sub });
    } catch (err) {
        res.status(400).json({ msg: "Update failed", error: err.message });
    }
};

export const getSubmissionsByStudent = async (req, res) => {
    try {
        const docs = await Submission
            .find({ studentId: req.params.id })
            .select("testId status");
        res.json(docs);
        // console.log(docs);                         
    } catch (err) {
        res.status(500).json({ msg: "Failed", error: err.message });
    }
};
