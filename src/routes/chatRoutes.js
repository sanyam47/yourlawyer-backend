import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import { askAI } from "../services/aiService.js";

// ✅ MOVE IMPORTS TO TOP
import { generateEmbedding } from "../services/embeddingService.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const router = express.Router();

/* =========================
   CREATE / SEND MESSAGE
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({
        userId,
        name: "Default Chat",
        summary: "",
        documents: [],
        messages: [],
      });
    }

    /* =========================
       1️⃣ SAVE USER MESSAGE
    ========================== */
    chat.messages.push({
      role: "user",
      content: message.trim(),
    });

    await chat.save();

    /* =========================
       2️⃣ SUMMARIZATION TRIGGER
    ========================== */
    if (chat.messages.length > 20) {
      const summaryPrompt = `
Summarize the important legal facts from this conversation.
Keep it short and structured.

${chat.messages.map(m => `${m.role}: ${m.content}`).join("\n")}
`;

      const newSummary = await askAI({
        summary: "",
        messages: [{ role: "user", content: summaryPrompt }],
        documentContext: "",
      });

      chat.summary = newSummary;
      chat.messages = chat.messages.slice(-10);

      await chat.save();
    }

    /* =========================
       3️⃣ REAL RAG RETRIEVAL
    ========================== */
    await chat.populate("documents");

    let documentContext = "";

    if (chat.documents?.length > 0) {

      const queryVector = await generateEmbedding(message);

      let scoredChunks = [];

      for (const doc of chat.documents) {
        for (const item of doc.embeddings || []) {

          if (!item.vector || item.vector.length === 0) continue;

          const score = cosineSimilarity(queryVector, item.vector);

          scoredChunks.push({
            chunk: item.chunk,
            score,
          });
        }
      }

      scoredChunks.sort((a, b) => b.score - a.score);

      const topChunks = scoredChunks.slice(0, 5);

      documentContext = topChunks.map(c => c.chunk).join("\n\n");
    }

    /* =========================
       4️⃣ BUILD RECENT CONTEXT
    ========================== */
    const recentMessages = chat.messages.slice(-10);

    /* =========================
       5️⃣ CALL AI
    ========================== */
    const aiReply = await askAI({
      summary: chat.summary,
      messages: recentMessages,
      documentContext,
    });

    /* =========================
       6️⃣ SAVE AI REPLY
    ========================== */
    chat.messages.push({
      role: "ai",
      content: aiReply,
    });

    await chat.save();

    return res.json({ reply: aiReply });

  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ message: "AI failed to respond" });
  }
});

/* =========================
   GET CHAT HISTORY
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const chat = await Chat.findOne({ userId });

    if (!chat) return res.json([]);

    return res.json(chat.messages);

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch chat history" });
  }
});

/* =========================
   ATTACH DOCUMENT TO CHAT
========================= */
router.post("/attach-document", verifyToken, async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.user?._id || req.user?.id;

    const chat = await Chat.findOne({ userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.documents.includes(documentId)) {
      chat.documents.push(documentId);
      await chat.save();
    }

    res.json({ message: "Document attached to chat" });

  } catch (error) {
    res.status(500).json({ message: "Failed to attach document" });
  }
});

export default router;
