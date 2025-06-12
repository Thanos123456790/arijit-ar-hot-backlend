import express from "express";
import { evaluateAnswersWithAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/evaluate", evaluateAnswersWithAI);

export default router;
