import express from 'express';
import { getTestResultsForTeacher,getResults,updateSubmissionStatuses } from "../controllers/resultController.js";

const router = express.Router();
router.get('/:testId', getResults);
router.get("/:testId", getTestResultsForTeacher);
router.put("/update-statuses", updateSubmissionStatuses);

export default router;