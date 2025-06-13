import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from './routes/testRoutes.js';
import submissionRoutes from "./routes/submissionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cheatingRoutes from "./routes/cheatingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import resetRoutes from "./routes/resetRoutes.js";
import { scheduleTestNotifications } from "./jobs/testNotifier.js";
import aiRoutes from "./routes/aiRoutes.js";



dotenv.config();
connectDB();
scheduleTestNotifications();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => res.send("API running 🏃‍♀️"));
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/tests', testRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/cheating", cheatingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reset", resetRoutes);



/* optional example of a protected route */
import { protect, restrictTo } from "./middlewares/authMiddleware.js";
app.get("/api/secret", protect, restrictTo("admin"), (_, res) =>
    res.json({ msg: "Top secret for admins only" })
);

const PORT = process.env.PORT || 3879;
app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
);
