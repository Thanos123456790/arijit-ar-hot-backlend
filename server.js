import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from './routes/testRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // body-parser

app.get("/", (_, res) => res.send("API running 🏃‍♀️"));

app.use("/api/auth", authRoutes);
app.use('/api/tests', testRoutes);

/* optional example of a protected route */
import { protect, restrictTo } from "./middlewares/authMiddleware.js";
app.get("/api/secret", protect, restrictTo("admin"), (_, res) =>
    res.json({ msg: "Top secret for admins only" })
);

const PORT = process.env.PORT || 3879;
app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
);
