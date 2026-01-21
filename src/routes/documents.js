import express from "express";
import multer from "multer";

const router = express.Router();

// Store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File received:", req.file.originalname);

    // TEMP TEST RESPONSE
    res.json({
      overall_risk_level: "MEDIUM",
      clauses: [
        {
          clause_text: "Tenant must insure the premises.",
          impact: "LEGAL OBLIGATION",
        },
        {
          clause_text: "Landlord may terminate on breach.",
          impact: "RISK",
        },
      ],
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
