import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";

const router = express.Router();


// 🔎 Find similar cases
router.get("/:caseId", verifyToken, async (req, res) => {
  try {
    const { caseId } = req.params;

    const currentCase = await Case.findById(caseId);
    if (!currentCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const allCases = await Case.find({
      _id: { $ne: caseId },
      userId: currentCase.userId,
    });

    const baseText = (
      currentCase.title +
      " " +
      (currentCase.description || "")
    ).toLowerCase();

    function similarityScore(text) {
      const words = baseText.split(" ");
      let score = 0;

      words.forEach((w) => {
        if (text.includes(w)) score++;
      });

      return Math.min(100, Math.round((score / words.length) * 100));
    }

    const ranked = allCases
      .map((c) => {
        const text = (c.title + " " + (c.description || "")).toLowerCase();
        return {
          _id: c._id,
          title: c.title,
          match: similarityScore(text),
          status: c.status,
        };
      })
      .filter((c) => c.match > 20)
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    res.json(ranked);
  } catch (error) {
    console.error("❌ Recommendation error:", error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
});

export default router;
