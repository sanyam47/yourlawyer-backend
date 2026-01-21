// ================================
// 🌱 ENV SETUP (ES MODULE SAFE)
// ================================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ================================
// 🚀 IMPORTS
// ================================
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import templateFillRoutes from "./routes/templateFillRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import onlineRecommendationRoutes from "./routes/onlineRecommendationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

// ================================
// ⚙️ APP SETUP
// ================================
const app = express();

// ✅ FIXED CORS CONFIG
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001", // ✅ frontend running here
    "https://yourlawyer.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ================================
// 🧩 MIDDLEWARE
// ================================
app.use("/generated", express.static("generated"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// 🛣 ROUTES
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/template-fill", templateFillRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/online-recommendations", onlineRecommendationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cases", caseRoutes);

// ================================
// ❤️ HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.status(200).send("✅ YourLawyer Backend is Running Successfully!");
});

// ================================
// 🔐 ENV VALIDATION
// ================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

// ================================
// 🗄 DATABASE + SERVER START
// ================================
connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
