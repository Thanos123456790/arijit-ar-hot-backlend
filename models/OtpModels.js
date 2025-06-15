import mongoose from "mongoose";

const Otp = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

Otp.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("Otp", Otp);
