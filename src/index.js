import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/**
 * ✅ CORS CONFIG (FINAL & CORRECT)
 * - Handles preflight (OPTIONS)
 * - Works with Vercel frontend
 * - Works with localhost
 * - No cookies (JWT based auth)
 */
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://yourlawyer.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔴 REQUIRED FOR PREFLIGHT

app.use(express.json());

/**
 * ✅ ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/templates", templateRoutes);

/**
 * ✅ HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.status(200).send("✅ YourLawyer Backend is Running Successfully!");
});

/**
 * ✅ SERVER + DB
 */
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourlawyer";

connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

