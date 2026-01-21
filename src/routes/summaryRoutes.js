import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import Case from "../models/Case.js";
import Message from "../models/Message.js";
import { askAI } from "../services/aiService.js";

const router = express.Router();

/* =========================
   GENERATE CASE SUMMARY
========================= */
router.get("/:caseId", verifyToken, async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    const messages = await Message.find({ caseId }).sort({
      createdAt: 1,
    });

    const timelineText = (caseItem.timeline || [])
      .map(
        (t) =>
          `${t.title} on ${new Date(t.date).toDateString()}`
      )
      .join(", ");

    const chatText = (messages || [])
      .map((m) => `User: ${m.text}`)
      .join("\n");

    const prompt = `
Summarize this legal case briefly for a user dashboard.

Timeline:
${timelineText || "No timeline yet"}

Chat:
${chatText || "No chat yet"}

Give a short 2-3 sentence summary.
`;

    const summary = await askAI(prompt);

    res.json({ summary });
  } catch (error) {
    console.error("❌ Summary error:", error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
});

export default router;
