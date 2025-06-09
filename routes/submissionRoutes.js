import express from "express";
import {
    getStudentSubmission,
    getSubmissionsByTest,
    updateSubmission,
    getSubmissionsByStudent,
} from "../controllers/submissionController.js";

const router = express.Router();

router.get("/student", getStudentSubmission);
router.get("/test/:testId", getSubmissionsByTest);
router.put("/:id", updateSubmission);
router.get("/student/:id", getSubmissionsByStudent);

export default router;
