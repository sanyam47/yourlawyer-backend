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
      enum: ["pdf", "doc", "docx", "txt"],
      required: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "analyzed"],
      default: "uploaded",
    },
    analysisResult: {
      type: Object, // later store AI insights here
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
