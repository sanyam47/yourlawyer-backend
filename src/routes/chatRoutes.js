import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Chat from "../models/chat.js";   // ✅ FIXED HERE
import { askAI } from "../services/aiService.js";

const router = express.Router();

/* =========================
   CREATE / SEND MESSAGE
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userId = req.user._id || req.user.id;

    // ✅ Save user message
    await Chat.create({
      userId,
      role: "user",
      message,
    });

    // ✅ Call Local AI (Ollama)
    const aiReply = await askAI(message);

    // ✅ Save AI reply
    await Chat.create({
      userId,
      role: "ai",
      message: aiReply,
    });

    // ✅ Send AI reply to frontend
    res.status(200).json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("❌ Chat AI error:", error);
    res.status(500).json({ message: "AI failed to respond" });
  }
});

/* =========================
   GET USER CHAT HISTORY
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("❌ Chat fetch error:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
});

export default router;
