import { askAI } from "../services/aiService.js";
import { extractTimelineFromText } from "../utils/ollamaExtractor.js";
import Case from "../models/Case.js";
import Message from "../models/Message.js";

export const chatAI = async (req, res) => {
  try {
    const { message, caseId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("🧠 chatController reached");

    // 💾 Save USER message
    if (caseId) {
      await Message.create({
        caseId,
        sender: "user",
        text: message,
      });
    }

    // 🤖 AI reply
    const reply = await askAI(message);

    // 💾 Save AI message
    if (caseId) {
      await Message.create({
        caseId,
        sender: "ai",
        text: reply,
      });
    }

    // 🧠 AUTO TIMELINE EXTRACTION
    try {
      if (caseId) {
        const extracted = await extractTimelineFromText(message);

        if (extracted) {
          console.log("📌 Timeline extracted:", extracted);

          const caseItem = await Case.findById(caseId);

          if (caseItem) {
            caseItem.timeline.push({
              title: extracted.title,
              date: extracted.date,
              status: extracted.status || "upcoming",
              notes: extracted.notes,
            });

            await caseItem.save();
            console.log("✅ Timeline event saved automatically");
          }
        }
      }
    } catch (err) {
      console.error("⚠️ Timeline extraction failed:", err);
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("❌ FULL AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI processing failed",
    });
  }
};
