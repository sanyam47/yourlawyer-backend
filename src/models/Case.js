import mongoose from "mongoose";

// 🧩 Timeline Event Schema
const timelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "missed"],
      default: "upcoming",
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);

// 📁 Case Schema
const caseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      default: "active",
    },

    // ✅ NEW TIMELINE FIELD
    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);

