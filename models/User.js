import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["student", "teacher", "admin"];

const baseOptions = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

/* base user: shared fields */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: roles, required: true },
  },
  baseOptions
);

/* hash pwd if modified */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* compare password helper */
UserSchema.methods.matchPassword = function (enteredPwd) {
  return bcrypt.compare(enteredPwd, this.password);
};

export const User = mongoose.model("User", UserSchema);

/* --- role-specific discriminators --- */

export const Student = User.discriminator(
  "student",
  new mongoose.Schema({
    rollNumber: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
  })
);

export const Teacher = User.discriminator(
  "teacher",
  new mongoose.Schema({
    employeeId: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
  })
);
