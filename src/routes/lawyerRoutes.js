import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { protectLawyer } from "../middleware/protectLawyer.js";
import {
  saveLawyerProfile,
  getLawyerProfile,
} from "../controllers/lawyerController.js";

const router = express.Router();

/* =========================
   LAWYER PROFILE (LAWYER ONLY)
========================= */

router.post("/profile", protectLawyer, saveLawyerProfile);
router.get("/profile", protectLawyer, getLawyerProfile);

/* =========================
   GET ALL LAWYERS
========================= */

router.get("/", async (req, res) => {
  try {
    const lawyers = await User.find({
      role: "lawyer",
    }).select("-password");

    res.json(lawyers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch lawyers" });
  }
});

/* =========================
   GET SINGLE LAWYER
========================= */

router.get("/:id", async (req, res) => {
  try {
    const lawyer = await User.findById(req.params.id)
      .select("-password")
      .populate("reviews.client", "name");

    if (!lawyer || lawyer.role !== "lawyer") {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.json(lawyer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch lawyer" });
  }
});

/* =========================
   RATE LAWYER
========================= */

router.put("/:id/rate", verifyToken, async (req, res) => {
  try {
    const { rating, review } = req.body;

    const lawyer = await User.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    if (lawyer.role !== "lawyer") {
      return res.status(400).json({ message: "User is not a lawyer" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    // Add review
    lawyer.reviews.push({
      client: req.user.id,
      rating,
      comment: review,
    });

    // Update rating stats
    lawyer.totalRatings = lawyer.reviews.length;

    lawyer.averageRating =
      lawyer.reviews.reduce((sum, r) => sum + r.rating, 0) /
      lawyer.totalRatings;

    await lawyer.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Rating failed" });
  }
});

export default router;
