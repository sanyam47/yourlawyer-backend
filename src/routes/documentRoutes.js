import express from "express";
import {
  uploadDocument,
  getUserDocuments,
  analyzeDocument,
} from "../controllers/documentController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { askQuestionAboutDocument } from "../controllers/documentQAController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =======================
   UPLOAD DOCUMENT
======================= */
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadDocument
);

/* =======================
   ANALYZE DOCUMENT
======================= */
router.post(
  "/analyze",
  verifyToken,
  upload.single("file"),
  analyzeDocument
);

/* =======================
   ASK QUESTIONS
======================= */
router.post(
  "/ask",
  verifyToken,
  askQuestionAboutDocument
);

/* =======================
   GET USER DOCUMENTS
======================= */
router.get(
  "/",
  verifyToken,
  getUserDocuments
);

export default router;
