import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =========================
   GET MY PROFILE
========================= */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* =========================
   UPDATE LAWYER PROFILE
========================= */
router.put(
  "/update",
  verifyToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { specialization, experience, bio, consultationFee } = req.body;

      const user = await User.findById(req.user.id);

      console.log("User ID from token:", req.user.id);
console.log("User role:", user.role);
console.log("File received:", req.file);


      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== "lawyer") {
        return res.status(403).json({ message: "Not allowed" });
      }

      user.specialization = specialization;
      user.experience = experience;
      user.bio = bio;
      user.consultationFee = consultationFee;
      user.profileCompleted = true;

      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      await user.save();

      res.json({
        success: true,
        user,
      });

    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);

/* =========================
   SET DATE + TIME AVAILABILITY
========================= */
router.put("/availability", verifyToken, async (req, res) => {
  try {
    const { availability } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "lawyer") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: "Invalid availability format" });
    }

    user.availability = availability;

    await user.save();

    res.json({
      success: true,
      availability: user.availability,
    });

  } catch (error) {
    console.error("Availability update error:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
});

/* =========================
   GET MY AVAILABILITY
========================= */
router.get("/availability", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ availability: user.availability || [] });

  } catch (error) {
    console.error("Fetch availability error:", error);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
});

export default router;
