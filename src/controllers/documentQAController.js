import Document from "../models/Document.js";
import { askAI } from "../services/aiService.js";

export const askQuestionAboutDocument = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ message: "Missing data" });
    }

    const doc = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!doc || !doc.extractedText) {
      return res.status(404).json({
        message: "Document text not found",
      });
    }

    const prompt = `
Answer ONLY using the document text below.

RULES:
- Do not use external knowledge
- If answer not found, say:
  "This is not mentioned in the document."

DOCUMENT:
${doc.extractedText}

QUESTION:
${question}

ANSWER:
`;

    const answer = await askAI(prompt);
    res.json({ answer });
  } catch (err) {
    console.error("Q&A error:", err);
    res.status(500).json({ message: "Failed to answer question" });
  }
};
