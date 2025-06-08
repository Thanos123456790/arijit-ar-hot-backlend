import express from "express";
import { getCommentsByTest,postComment } from "../controllers/commentController.js";

const router = express.Router();

router.post('/comment', postComment);
router.get("/:testId", getCommentsByTest);

export default router;
