import express from "express";
import axios from "axios";
import Chat from "../models/Chat.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================
   TEMP AI CHAT (WITH SERP SUGGESTIONS)
====================================== */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    /* ===== AI RESPONSE (Ollama) ===== */
    const aiResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "mistral",
        prompt: message,
        stream: false,
      }
    );

    const aiReply = aiResponse.data.response;

    /* ===== SERP API SEARCH ===== */
    const serpResponse = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          q: message + " Indian legal case law site:indiankanoon.org OR site:sci.gov.in",
          api_key: process.env.SERP_API_KEY,
          engine: "google",
        },
      }
    );

    const results =
      serpResponse.data.organic_results?.slice(0, 3) || [];

    const similarCases = results.map((item) => ({
      title: item.title,
      link: item.link,
    }));

    res.json({
      reply: aiReply,
      similarCases,
    });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

/* ======================================
   REGISTER CHAT
====================================== */
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { name, description, messages } = req.body;

    const chat = await Chat.create({
      userId: req.user.id,
      name,
      description: description || "",
      messages: messages || [],
    });

    res.json(chat);

  } catch (error) {
    res.status(500).json({ message: "Save failed" });
  }
});

/* ======================================
   GET SAVED CHATS
====================================== */
router.get("/saved", verifyToken, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id })
    .sort({ updatedAt: -1 });

  res.json(chats);
});

/* ======================================
   GET SINGLE CHAT
====================================== */
router.get("/:chatId", verifyToken, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ message: "Not found" });
  res.json(chat);
});

/* ======================================
   DELETE CHAT
====================================== */
router.delete("/:chatId", verifyToken, async (req, res) => {
  await Chat.findByIdAndDelete(req.params.chatId);
  res.json({ success: true });
});

/* ======================================
   CONTINUE SAVED CHAT
====================================== */
router.post("/:chatId/message", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ role: "user", content: message });

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "mistral",
        prompt: message,
        stream: false,
      }
    );

    const aiReply = response.data.response;

    chat.messages.push({ role: "assistant", content: aiReply });

    await chat.save();

    res.json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ message: "AI failed" });
  }
});

export default router;
