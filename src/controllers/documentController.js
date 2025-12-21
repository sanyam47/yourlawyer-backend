import Document from "../models/Document.js";
import fs from "fs";
import { execFile } from "child_process";
import { analyzeDocumentWithAI } from "../services/documentAIService.js";

/* =======================
   Upload Document
======================= */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = req.file.originalname.split(".").pop().toLowerCase();
    const allowed = ["pdf", "doc", "docx", "txt"];

    if (!allowed.includes(fileType)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const newDoc = new Document({
      user: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType,
    });

    await newDoc.save();

    return res.status(201).json({
      message: "File uploaded successfully",
      document: newDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

/* =======================
   Get User Documents
======================= */
export const getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(docs);
  } catch (err) {
    console.error("Get docs error:", err);
    return res.status(500).json({ message: "Failed to fetch documents" });
  }
};

/* =======================
   Analyze Document (FINAL)
======================= */
export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 Uploaded file:", req.file.path);

    const pdfPath = req.file.path;
    const outputTxtPath = pdfPath.replace(/\.pdf$/i, ".txt");

    const pdfToTextPath =
  "C:\\poppler\\Library\\bin\\poppler-25.12.0\\Library\\bin\\pdftotext.exe";


    execFile(
      pdfToTextPath,
      [pdfPath, outputTxtPath],
      async (error, stdout, stderr) => {
        if (error) {
          console.error("❌ pdftotext error:", error);
          console.error("❌ stderr:", stderr);
          return res
            .status(500)
            .json({ message: "Failed to extract text from PDF" });
        }

        if (!fs.existsSync(outputTxtPath)) {
          return res
            .status(500)
            .json({ message: "Text file not generated from PDF" });
        }

        const documentText = fs.readFileSync(outputTxtPath, "utf8");

        if (!documentText || documentText.length < 50) {
          return res
            .status(400)
            .json({ message: "Document text too short" });
        }

        const analysis = await analyzeDocumentWithAI(documentText);

        return res.status(200).json({
          success: true,
          analysis,
        });
      }
    );
  } catch (err) {
    console.error("❌ Analyze document error:", err);
    return res.status(500).json({ message: "Document analysis failed" });
  }
};
