import express from "express";
import {
    getStudentSubmission,
    getSubmissionsByTest,
    updateSubmission
} from "../controllers/submissionController.js";

const router = express.Router();

router.get("/student", getStudentSubmission);
router.get("/test/:testId", getSubmissionsByTest);
router.put("/:id", updateSubmission);

export default router;
