import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Template from "../models/Template.js";

const router = express.Router();

/* =========================
   CREATE TEMPLATE
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const template = await Template.create({
      userId: req.user._id || req.user.id,
      title,
      content,
    });

    res.status(201).json(template);
  } catch (error) {
    console.error("❌ Create template error:", error);
    res.status(500).json({ message: "Failed to create template" });
  }
});

/* =========================
   GET USER TEMPLATES
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const templates = await Template.find({
      userId: req.user._id || req.user.id,
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    console.error("❌ Fetch templates error:", error);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});

export default router;
