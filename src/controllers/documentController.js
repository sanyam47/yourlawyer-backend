import Document from "../models/Document.js";
import { analyzeDocumentWithAI } from "../services/documentAIService.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { generateEmbedding } from "../services/embeddingService.js";

/* =======================
   HELPER: SPLIT INTO CHUNKS
======================= */
function splitIntoChunks(text, size = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

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
   ANALYZE DOCUMENT + CREATE EMBEDDINGS
======================= */
export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let documentText = "";

    /* ================= IMAGE → OCR ================= */
    if (mimeType.startsWith("image/")) {
      documentText = await extractTextFromImage(filePath);
    }

    /* ================= PDF → ImageMagick → OCR ================= */
    else if (mimeType === "application/pdf") {
      const { execFile } = await import("child_process");
      const outputImage = filePath.replace(".pdf", ".png");

      await new Promise((resolve, reject) => {
        execFile(
          "magick",
          ["-density", "150", filePath + "[0]", "-quality", "100", outputImage],
          (err) => (err ? reject(err) : resolve())
        );
      });

      documentText = await extractTextFromImage(outputImage);
    }

    /* ================= VALIDATION ================= */
    if (!documentText || documentText.trim().length < 20) {
      return res.status(400).json({
        message: "Unable to extract readable text from document",
      });
    }

    /* ================= SPLIT INTO CHUNKS ================= */
    const chunks = splitIntoChunks(documentText, 800);

    const embeddings = [];

    for (const chunk of chunks) {
      const vector = await generateEmbedding(chunk);

      embeddings.push({
        chunk,
        vector,
      });
    }

    /* ================= AI ANALYSIS ================= */
    const analysis = await analyzeDocumentWithAI(documentText);

    /* ================= SAVE TO DB ================= */
    const doc = await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filePath: filePath,
      fileType: mimeType.startsWith("image/") ? "image" : "pdf",
      extractedText: documentText,
      analysisResult: analysis,
      embeddings, // 🔥 REAL VECTOR STORAGE
      status: "analyzed",
    });

    return res.status(200).json({
      success: true,
      analysis,
      documentId: doc._id,
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
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};
