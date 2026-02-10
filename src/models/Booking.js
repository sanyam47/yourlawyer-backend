import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: String,

    date: Date,
    timeSlot: String,

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    chatEnabled: {
      type: Boolean,
      default: false,
    },

    rating: Number,
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
