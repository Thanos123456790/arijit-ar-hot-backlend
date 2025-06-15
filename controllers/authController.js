import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Student, Teacher } from "../models/User.js";
import Otp from "../models/OtpModels.js";
import { generateOtp, sendOtpEmail } from "../utils/otpUtil.js";

dotenv.config();

/* utility to generate JWT */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });


export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    /* find by email + role */
    const user = await User.findOne({ email, role });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ msg: "Invalid credentials" });

    return res.json({
      token: generateToken(user._id),
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


// POST /api/auth/register/otp
export const sendOtpForRegistration = async (req, res) => {
  try {
    const { email, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp, name);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};


export const verifyOtp = async (req, res) => {
  console.log(req.body);
  try {
    const {
      role,
      name,
      email,
      phone,
      password,
      otp,
      rollNumber,
      branch,
      semester,
      employeeId,
      department,
      designation,
    } = req.body;

    const rec = await Otp.findOne({ email });
    console.log("rec",rec);
    if (!rec || rec.otp !== otp){
      console.log("otp not found");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (rec.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    let newUser;
    if (role === "student") {
      newUser = await Student.create({
        name,
        email,
        phone,
        password,
        role,
        rollNumber,
        branch,
        semester,
      });
    } else if (role === "teacher") {
      newUser = await Teacher.create({
        name,
        email,
        phone,
        password,
        role,
        employeeId,
        department,
        designation,
      });
    } else if (role === "admin") {
      newUser = await User.create({
        name,
        email,
        phone,
        password,
        role,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await Otp.deleteOne({ email });

    res.status(201).json({
      message: "Registration successful!",
      user: { ...newUser.toObject(), password: undefined },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};
