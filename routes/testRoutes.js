import express from 'express';
import { getTests,getTeacherTests, createTest, updateTest, postComment, deleteTest, assignTest } from "../controllers/testController.js";

const router = express.Router();

router.get('/', getTests);
router.get('/teacher-tests',getTeacherTests)
router.post('/comment', postComment);
router.post("/", createTest);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);
router.patch("/:id/assign", assignTest);

export default router;
