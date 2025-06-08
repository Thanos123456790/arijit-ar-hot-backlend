import express from 'express';
import { submitTest, getResults } from '../controllers/resultController.js';
const router = express.Router();
router.post('/submit', submitTest);
router.get('/:testId', getResults);
export default router;