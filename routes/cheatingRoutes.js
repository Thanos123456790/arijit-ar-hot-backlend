import express from "express";
import {
    logCheatingEvent,
    getCheatingLogsByTest,
} from "../controllers/cheatingController.js";

const router = express.Router();

router.post("/", logCheatingEvent);
router.get("/:testId", getCheatingLogsByTest);

export default router;
