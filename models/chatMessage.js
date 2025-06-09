import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        role: { type: String, enum: ["student", "teacher", "admin"], required: true },
        department: { type: String, default: "" },
        semester: { type: String, default: "" },
    },
    { timestamps: true }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
