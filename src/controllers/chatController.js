import { chatWithAI } from "../services/chatAIService.js";

export const chatAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chatWithAI(message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({ message: "AI chat failed" });
  }
};
