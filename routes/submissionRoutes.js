import express from "express";
import { getStudentSubmission } from "../controllers/submissionController.js";

const router = express.Router();
router.get("/student", getStudentSubmission);

export default router;
