import { User, Student, Teacher } from "../models/User.js";

/* ------------------------------------------------------------------
  GET /api/users          – all non-admin users
------------------------------------------------------------------ */
export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
};

/* ------------------------------------------------------------------
  POST /api/users         – create a student / teacher / admin
------------------------------------------------------------------ */
export const createUser = async (req, res) => {
  const {
    name, email, password, role,
    phone, address, dateOfBirth, bio, gender, image,
    branch, semester, rollNumber,        // student-only
    employeeId, department, designation, // teacher-only
  } = req.body;

  try {
    let newUser;

    if (role === "student") {
      newUser = new Student({
        name, email, password, role,
        phone, address, dateOfBirth, bio, gender, image,
        branch, semester, rollNumber,
      });
    } else if (role === "teacher") {
      newUser = new Teacher({
        name, email, password, role,
        phone, address, dateOfBirth, bio, gender, image,
        employeeId, department, designation,
      });
    } else if (role === "admin") {
      newUser = new User({
        name, email, password, role,
        phone, address, dateOfBirth, bio, gender, image,
      });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }

    await newUser.save();
    const safe = newUser.toObject();
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "E-mail already in use" });
    }
    res.status(500).json({ msg: "Failed to create user", error: err.message });
  }
};

/* ------------------------------------------------------------------
  DELETE /api/users/:id   – remove a user
------------------------------------------------------------------ */
export const deleteUser = async (req, res) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Deletion failed", error: err.message });
  }
};

/* ------------------------------------------------------------------
  PUT /api/users/:id      – update profile / extra info
------------------------------------------------------------------ */
export const updateUser = async (req, res) => {
  const allowed = [
    "name", "phone", "address", "dateOfBirth", "bio", "gender", "image",
    "branch", "semester", "rollNumber",
    "department", "designation", "employeeId",
  ];

  const patch = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) patch[k] = req.body[k];
  });

  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      patch,
      { new: true, runValidators: true },
    ).select("-password");

    if (!updated) return res.status(404).json({ msg: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

/* GET /api/users/:id – single user (without password) */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

