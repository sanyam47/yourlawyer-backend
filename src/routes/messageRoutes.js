import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

const router = express.Router();

/* =========================
   SEND MESSAGE
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message is required" });
    }

    const message = await Message.create({
      userId: req.user.id,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* =========================
   GET USER MESSAGES
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
