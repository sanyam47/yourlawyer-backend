import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["client", "lawyer"],
      default: "client",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    specialization: String,
    experience: Number,
    bio: String,
    consultationFee: Number,
    profileImage: String,

    /* ⭐ RATING SYSTEM */

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    /* 📅 AVAILABILITY */

    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
