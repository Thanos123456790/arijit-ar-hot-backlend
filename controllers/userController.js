import { User, Student, Teacher } from "../models/User.js";

// GET all non-admin users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
};

// POST create a new user
export const createUser = async (req, res) => {
  const { name, email, password, role, branch, semester, rollNumber, employeeId, department, designation } = req.body;
  try {
    let newUser;
    if (role === "student") {
      newUser = new Student({ name, email, password, role, branch, semester, rollNumber });
    } else if (role === "teacher") {
      newUser = new Teacher({ name, email, password, role, employeeId, department, designation });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }
    await newUser.save();
    const safeUser = newUser.toObject();
    delete safeUser.password;
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create user", error: err.message });
  }
};

// DELETE user by id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Deletion failed", error: err.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateFields = { ...req.body };
  delete updateFields.password; // optional password change not handled
  try {
    const updated = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};