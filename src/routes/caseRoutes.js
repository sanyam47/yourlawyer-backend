import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";

const router = express.Router();

/* =========================
   CREATE CASE
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Case title is required" });
    }

    const newCase = await Case.create({
      userId: req.user._id || req.user.id,
      title,
      description,
      status: "open",
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error("❌ Create case error:", error);
    res.status(500).json({ message: "Failed to create case" });
  }
});

/* =========================
   GET USER CASES
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const cases = await Case.find({
      userId: req.user._id || req.user.id,
    }).sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error("❌ Fetch cases error:", error);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
});

/* =========================
   GET SINGLE CASE
========================= */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const caseItem = await Case.findOne({
      _id: req.params.id,
      userId: req.user._id || req.user.id,
    });

    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(caseItem);
  } catch (error) {
    console.error("❌ Get case error:", error);
    res.status(500).json({ message: "Failed to fetch case" });
  }
});

export default router;
