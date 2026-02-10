import dotenv from "dotenv";
dotenv.config();
import aiRoutes from "./routes/aiRoutes.js";

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// ================= MODELS =================
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔥 Make io available in routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_room", (bookingId) => {
    if (!bookingId) return;
    socket.join(bookingId);
  });

  socket.on("send_message", async (data) => {
    try {
      if (!data.bookingId || !data.senderId || !data.message) return;

      const savedMessage = await Message.create({
        booking: data.bookingId,
        sender: data.senderId,
        text: data.message,
      });

      io.to(data.bookingId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Message save error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= MIDDLEWARE =================
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/ai-chat", aiRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/documents", documentRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server start failed:", err.message);
  }
};

startServer();
