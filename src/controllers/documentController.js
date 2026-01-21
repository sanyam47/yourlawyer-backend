import Document from "../models/Document.js";
import fs from "fs";
import { execFile } from "child_process";
import { analyzeDocumentWithAI } from "../services/documentAIService.js";
import { extractTextFromImage } from "../utils/ocr.js";

/* =======================
   UPLOAD DOCUMENT
======================= */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = req.file.mimetype.startsWith("image/")
      ? "image"
      : req.file.mimetype === "application/pdf"
      ? "pdf"
      : "other";

    const doc = await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType,
      status: "uploaded",
    });

    return res.status(201).json({
      message: "File uploaded",
      document: doc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* =======================
   ANALYZE DOCUMENT  ✅ FIXED
======================= */
export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let documentText = "";

    /* IMAGE → OCR */
    if (mimeType.startsWith("image/")) {
      documentText = await extractTextFromImage(filePath);
    }

    /* PDF → TEXT → OCR FALLBACK */
    else if (mimeType === "application/pdf") {
      const outputTxt = filePath.replace(/\.pdf$/i, ".txt");
      const pdfToTextPath =
        "C:\\poppler\\Library\\bin\\poppler-25.12.0\\Library\\bin\\pdftotext.exe";

      await new Promise((resolve, reject) => {
        execFile(
          pdfToTextPath,
          ["-layout", filePath, outputTxt],
          (err) => (err ? reject(err) : resolve())
        );
      });

      if (fs.existsSync(outputTxt)) {
        documentText = fs.readFileSync(outputTxt, "utf8");
      }

      // OCR fallback for scanned PDFs
      if (!documentText || documentText.trim().length < 30) {
        documentText = await extractTextFromImage(filePath);
      }
    }

    if (!documentText || documentText.trim().length < 30) {
      return res.status(400).json({
        message: "Unable to extract readable text from document",
      });
    }

    const analysis = await analyzeDocumentWithAI(documentText);

    // ✅ CREATE DOCUMENT HERE (SOURCE OF TRUTH)
    const doc = await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: mimeType.startsWith("image/") ? "image" : "pdf",
      extractedText: documentText,
      analysisResult: analysis,
      status: "analyzed",
    });

    return res.status(200).json({
      success: true,
      analysis,
      documentId: doc._id, // 🔑 FRONTEND NEEDS THIS
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ message: "Analysis failed" });
  }
};

/* =======================
   GET USER DOCUMENTS
======================= */
export const getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

