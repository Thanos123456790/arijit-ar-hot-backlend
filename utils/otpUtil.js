import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export const sendOtpEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
        from: `"Exam OTP" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
    });
};
