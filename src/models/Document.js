import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "image", "other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "analyzed"],
      default: "uploaded",
    },

    extractedText: {
      type: String,
      default: "",
    },

    analysisResult: {
      type: Object,
      default: null,
    },

    // ✅ REAL RAG STORAGE
    embeddings: [
      {
        chunk: String,
        vector: [Number],
      },
    ],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
