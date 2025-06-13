import express from "express";
import {
    requestResetOtp,
    verifyResetOtp,
    resetPassword,
} from "../controllers/resetController.js";

const router = express.Router();

router.post("/request-otp", requestResetOtp);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
