import { User } from "../models/User.js";
import { Otp } from "../models/otpSchema.js";
import { generateOtp, sendOtpEmail } from "../utils/otpUtil.js";

/* Step 1: Request OTP */
export const requestResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });

    const otp = generateOtp();
    await Otp.deleteMany({ email }); // Invalidate old OTPs
    await Otp.create({ email, otp });
    await sendOtpEmail(email, otp);

    res.json({ msg: "OTP sent to email." });
};

/* Step 2: Verify OTP */
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: "Email and OTP are required." });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ msg: "Invalid or expired OTP." });

    res.json({ msg: "OTP verified." });
};

export const resetPassword = async (req, res) => {
    const { email, password: newPassword } = req.body;
    console.log(req.body);

    if (!email || !newPassword) {
        return res.status(401).json({ msg: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email });

    res.json({ msg: "Password updated successfully." });
};

