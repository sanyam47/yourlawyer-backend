import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

/* =========================
   CREATE BOOKING
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { lawyerId, date, notes } = req.body;

    if (!lawyerId || !date) {
      return res
        .status(400)
        .json({ message: "Lawyer and date are required" });
    }

    const booking = await Booking.create({
      userId: req.user._id || req.user.id,
      lawyerId,
      date,
      notes,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Create booking error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

/* =========================
   GET USER BOOKINGS
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id || req.user.id,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("❌ Fetch bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default router;
