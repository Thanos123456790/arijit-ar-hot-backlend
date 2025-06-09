import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// …other imports…

dotenv.config();
connectDB();

const app = express();

/* ---------- CORS ---------- */
const whitelist = [
  "http://localhost:5173",               // local dev
  "https://your-frontend.vercel.app",    // prod front-end (change to yours)
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman/axios with no origin or anything in the whitelist
      if (!origin || whitelist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// **Handle the OPTIONS pre-flight for every route**
app.options("*", cors());

/* ---------- Body parsers ---------- */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
app.get("/", (_, res) => res.send("API running 🏃‍♀️"));
app.use("/api/auth", authRoutes);
// …other routers…

/* ---------- Server ---------- */
const PORT = process.env.PORT || 3879;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
