import express from 'express';
import { getTestResultsForTeacher } from "../controllers/resultController.js";
import { submitTest, getResults } from '../controllers/resultController.js';

const router = express.Router();
router.post('/submit', submitTest);
router.get('/:testId', getResults);
router.get("/:testId", getTestResultsForTeacher);

export default router;