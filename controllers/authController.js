import jwt from "jsonwebtoken";
import { User, Student, Teacher } from "../models/User.js";

/* utility to generate JWT */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/* POST /api/auth/register */
export const registerUser = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      phone,
      password,
      rollNumber,
      branch,
      semester,
      employeeId,
      department,
      designation,
    } = req.body;

    /* uniqueness check */
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "Email already in use" });

    /* choose model by role */
    let newUser;
    if (role === "student") {
      newUser = await Student.create({
        role,
        name,
        email,
        phone,
        password,
        rollNumber,
        branch,
        semester,
      });
    } else if (role === "teacher") {
      newUser = await Teacher.create({
        role,
        name,
        email,
        phone,
        password,
        employeeId,
        department,
        designation,
      });
    } else if (role === "admin") {
      newUser = await User.create({ role, name, email, phone, password });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }

    return res.status(201).json({
      token: generateToken(newUser._id),
      user: { ...newUser.toObject(), password: undefined },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

/* POST /api/auth/login */
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
