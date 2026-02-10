import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CREATE BOOKING
========================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { lawyerId, message } = req.body;

    const booking = await Booking.create({
      client: req.user.id,
      lawyer: lawyerId,
      message,
      status: "pending",
      paymentStatus: "unpaid",
      chatEnabled: false,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* =========================
   GET CLIENT BOOKINGS
========================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      client: req.user.id,
    })
      .populate("lawyer", "name specialization averageRating profileImage")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =========================
   GET LAWYER BOOKINGS
========================= */
router.get("/lawyer", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      lawyer: req.user.id,
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =========================
   CONFIRM BOOKING (LAWYER)
========================= */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status, date, timeSlot } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.lawyer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    if (status === "confirmed") {
      booking.status = "confirmed";
      booking.date = date;
      booking.timeSlot = timeSlot;
      booking.paymentStatus = "unpaid";
      booking.chatEnabled = false;
    }

    if (status === "rejected") {
      booking.status = "rejected";
    }

    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   DEMO PAYMENT (CLIENT)
========================= */
router.put("/:id/pay", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.client.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    if (booking.status !== "confirmed")
      return res.status(400).json({ message: "Not confirmed yet" });

    booking.paymentStatus = "paid";
    booking.chatEnabled = true;

    await booking.save();

    const updatedBooking = await Booking.findById(req.params.id)
      .populate("lawyer", "name specialization averageRating profileImage");

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
});

/* =========================
   RATE LAWYER
========================= */
router.put("/:id/rate", verifyToken, async (req, res) => {
  try {
    const { rating, review } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.client.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    const lawyer = await User.findById(booking.lawyer);

    lawyer.totalRatings = (lawyer.totalRatings || 0) + 1;
    lawyer.averageRating =
      ((lawyer.averageRating || 0) * (lawyer.totalRatings - 1) + rating) /
      lawyer.totalRatings;

    await lawyer.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Rating failed" });
  }
});

export default router;
