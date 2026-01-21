import Booking from "../models/Booking.js";
import Lawyer from "../models/Lawyer.js";

// ===============================
// CLIENT → CREATE BOOKING
// ===============================
export const createBooking = async (req, res) => {
  try {
    const { lawyerId, caseDescription } = req.body;

    if (!lawyerId || !caseDescription) {
      return res.status(400).json({ message: "Missing data" });
    }

    const booking = await Booking.create({
      client: req.user.id,
      lawyer: lawyerId,
      caseDescription,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// ===============================
// LAWYER → GET OWN BOOKINGS
// ===============================
export const getLawyerBookings = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.user.id });

    if (!lawyer) {
      return res.json([]); // ALWAYS array
    }

    const bookings = await Booking.find({ lawyer: lawyer._id })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load bookings" });
  }
};

// ===============================
// LAWYER → ACCEPT / REJECT BOOKING
// ===============================
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking" });
  }
};
