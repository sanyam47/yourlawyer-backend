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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yourlawyer.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ REQUIRED FOR PREFLIGHT
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/templates", templateRoutes);

app.get("/", (req, res) => {
  res.send("✅ YourLawyer Backend is Running Successfully!");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourlawyer";

connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
