import { encrypt, decrypt } from "../utils/encryption.js";
import express from "express";
import axios from "axios";

import { verifyToken } from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import { askAI } from "../services/aiService.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const router = express.Router();



/* =====================================================
   SEND MESSAGE (DOES NOT CREATE NEW CHAT AUTOMATICALLY)
===================================================== */

router.post("/", verifyToken, async (req, res) => {
  try {

    const { message, chatId } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message required" });
    }

    /* ================= DOCUMENT RAG ================= */

let documentContext = "";

if (chatId) {

  const chat = await Chat.findOne({
    _id: chatId,
    userId
  }).populate("documents");

  if (chat && chat.documents?.length) {

    const queryVector = await generateEmbedding(message);

    let scoredChunks = [];

    for (const doc of chat.documents) {
      for (const item of doc.embeddings || []) {

        if (!item.vector) continue;

        const score = cosineSimilarity(queryVector, item.vector);

        scoredChunks.push({
          chunk: item.chunk,
          score,
        });

      }
    }

    scoredChunks.sort((a, b) => b.score - a.score);

    const topChunks = scoredChunks.slice(0, 5);

    documentContext = topChunks
      .map(c => c.chunk)
      .join("\n\n");

  }
}


    /* ================= AI RESPONSE ================= */

    const aiReply = await askAI({
      messages: [
        {
          role: "user",
          content: message,
        }
      ],
      documentContext,
    });



    /* ================= SERP SEARCH ================= */

    let similarCases = [];

    try {

      const serpResponse = await axios.get(
        "https://serpapi.com/search.json",
        {
          params: {
            q:
              message +
              " Indian legal case law site:indiankanoon.org OR site:sci.gov.in",
            api_key: process.env.SERP_API_KEY,
            engine: "google",
          },
        }
      );

      const results =
        serpResponse.data.organic_results?.slice(0, 3) || [];

      similarCases = results.map(item => ({
        title: item.title,
        link: item.link,
      }));

    } catch {
      similarCases = [];
    }



    res.json({
      reply: aiReply,
      similarCases,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "AI failed",
    });

  }
});



/* =====================================================
   SAVE NEW CHAT
===================================================== */

router.post("/register", verifyToken, async (req, res) => {

  try {

    const { name, description, messages } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name required",
      });
    }

    const chat = await Chat.create({
      userId: req.user.id,
      name,
      description: description || "",
      messages: (messages || []).map(msg => ({
        role: msg.role,
        content: encrypt(msg.content)
      })),
    });

    /* decrypt before returning */

    chat.messages = chat.messages.map(msg => ({
      role: msg.role,
      content: decrypt(msg.content)
    }));

    res.json(chat);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Save failed",
    });

  }

});



/* ================= GET CHAT HISTORY ================= */

router.get("/history", verifyToken, async (req, res) => {
  try {

    const chats = await Chat.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const decryptedChats = chats.map(chat => ({
      ...chat._doc,
      messages: chat.messages.map(msg => ({
        role: msg.role,
        content: decrypt(msg.content)
      }))
    }));

    res.json(decryptedChats);

  } catch (err) {
    res.status(500).json({
      message: "Failed to load chat history",
    });
  }
});



/* =====================================================
   GET SINGLE CHAT
===================================================== */

router.get("/:chatId", verifyToken, async (req, res) => {

  try {

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    chat.messages = chat.messages.map(msg => ({
      role: msg.role,
      content: decrypt(msg.content)
    }));

    res.json(chat);

  } catch {

    res.status(500).json({
      message: "Failed",
    });

  }

});



/* =====================================================
   DELETE CHAT
===================================================== */

router.delete("/:chatId", verifyToken, async (req, res) => {

  try {

    await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userId: req.user.id
    });

    res.json({
      success: true,
    });

  } catch {

    res.status(500).json({
      message: "Delete failed",
    });

  }

});



export default router;