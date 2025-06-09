import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ---- shared base schema ---- */
const roles = ["student", "teacher", "admin"];
const baseOptions = {
  discriminatorKey: "role",   // <- stores role inside the same collection
  collection: "users",
  timestamps: true,
};

const UserSchema = new mongoose.Schema(
  {
    /* core */
    name:     { type: String, trim: true },
    email:    { type: String, required: true, unique: true },
    phone:    { type: String },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: roles, required: true },

    /* profile extras (match the React form) */
    address:     { type: String },
    dateOfBirth: { type: Date },
    bio:         { type: String },
    gender:      { type: String, enum: ["male", "female", "other", ""] },
    image:       { type: String },            // base64 string or URL
  },
  baseOptions
);

/* hash password only when it’s changed */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* compare-password helper */
UserSchema.methods.matchPassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export const User = mongoose.model("User", UserSchema);

/* ---- student & teacher discriminators ---- */
export const Student = User.discriminator(
  "student",
  new mongoose.Schema({
    rollNumber: { type: String, required: true },
    branch:     { type: String, required: true },
    semester:   { type: String, required: true },
  })
);

export const Teacher = User.discriminator(
  "teacher",
  new mongoose.Schema({
    employeeId:  { type: String, required: true },
    department:  { type: String, required: true },
    designation: { type: String, required: true },
  })
);
