import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, partyA, partyB, details } = req.body;

    const prompt = `
Generate a professional ${type} under Indian law.

Party A: ${partyA}
Party B: ${partyB}

Details:
${details}

Make it legally structured with headings and clauses.
`;

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "mistral",
        prompt,
        stream: false,
      }
    );

    res.json({
      document: response.data.response,
    });

  } catch (error) {
    console.error("TEMPLATE ERROR:", error.message);
    res.status(500).json({ error: "Template generation failed" });
  }
});

export default router;

import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

router.post("/pdf", async (req, res) => {
  try {
    const { content } = req.body;

    const doc = new PDFDocument();
    const filePath = path.join("generated.pdf");

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(12).text(content);
    doc.end();

    doc.on("finish", () => {
      res.download(filePath);
    });

  } catch (err) {
    res.status(500).json({ error: "PDF failed" });
  }
});
