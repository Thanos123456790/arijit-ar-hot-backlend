import express from "express";
import {
  loginUser,
  sendOtpForRegistration,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/otp", sendOtpForRegistration);
router.post("/login", loginUser);
router.post("/register/verify", verifyOtp);

export default router;
