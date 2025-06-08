import express from 'express';
import { getCheatingLogs } from '../controllers/monitorController.js';
const router = express.Router();
router.get('/logs/:testId', getCheatingLogs);
export default router;