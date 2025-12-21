import express from "express";
import {
  uploadDocument,
  getUserDocuments,
  analyzeDocument,
} from "../controllers/documentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload document
router.post("/upload", verifyToken, upload.single("file"), uploadDocument);

// Get user documents
router.get("/", verifyToken, getUserDocuments);

// 🔥 AI document analysis
router.post("/analyze", verifyToken, upload.single("file"), analyzeDocument);

export default router;
