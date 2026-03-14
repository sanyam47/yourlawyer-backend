import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import { verifyToken } from "../middleware/authMiddleware.js";
import Document from "../models/Document.js";
import Chat from "../models/Chat.js";

import { askAI } from "../services/aiService.js";
import { generateEmbedding } from "../services/embeddingService.js";

const router = express.Router();

/* ===============================
   MULTER CONFIG
================================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = "uploads/";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);

  },
});

const upload = multer({ storage });

/* ===============================
   ANALYZE DOCUMENT
================================ */

router.post(
  "/analyze",
  verifyToken,
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const filePath = req.file.path;

      /* READ FILE */

      const content = fs.readFileSync(
        filePath,
        "utf-8"
      );

      /* AI ANALYSIS */

      const analysis = await askAI({
        messages: [
          {
            role: "user",
            content: "Analyze this legal document:\n\n" + content,
          },
        ],
        documentContext: content,
      });

      /* CREATE EMBEDDING */

      const embedding = await generateEmbedding(content);

      /* SAVE DOCUMENT */

      const document = await Document.create({

        user: req.user.id,

        originalName: req.file.originalname,

        filePath: filePath,

        fileType: "other",

        extractedText: content,

        analysisResult: analysis,

        embeddings: [
          {
            chunk: content,
            vector: embedding,
          },
        ],

      });

      /* ATTACH DOCUMENT TO CHAT */

      if (req.body.chatId) {

        await Chat.findByIdAndUpdate(
          req.body.chatId,
          {
            $push: { documents: document._id },
          }
        );

      }

      res.json({
        success: true,
        document,
        analysis,
      });

    } catch (error) {

      console.error("DOCUMENT ERROR:", error);

      res.status(500).json({
        message: "Document analysis failed",
      });

    }

  }
);

/* ===============================
   GET USER DOCUMENTS
================================ */

router.get(
  "/",
  verifyToken,
  async (req, res) => {

    try {

      const docs = await Document.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(docs);

    } catch {

      res.status(500).json({
        message: "Failed to fetch documents",
      });

    }

  }
);

export default router;