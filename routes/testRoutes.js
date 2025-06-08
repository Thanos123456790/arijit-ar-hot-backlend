import express from 'express';
import { getTests,getTeacherTests, createTest, updateTest, deleteTest, assignTest,submitTest,getTestById } from "../controllers/testController.js";

const router = express.Router();

router.get('/', getTests);
router.get('/teacher-tests',getTeacherTests)
router.post("/", createTest);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);
router.patch("/:id/assign", assignTest);
router.post("/:id/submit", submitTest);
router.get("/:id", getTestById);


export default router;
