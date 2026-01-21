import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: { type: String, required: true },

    specialization: { type: [String], required: true },

    city: { type: String, required: true },

    state: { type: String, required: true },

    // 👇 USER INPUT (FREE TEXT)
    experienceText: {
      type: String, // "10+", "8 yrs", "5-7"
      required: true,
    },

    // 👇 SYSTEM VALUE (FOR LOGIC)
    experienceYears: {
      type: Number, // 10, 8, 5
      required: true,
    },

    phone: String,

    consultationType: {
      type: String,
      enum: ["Online", "Offline", "Both"],
      default: "Both",
    },

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lawyer", lawyerSchema);
