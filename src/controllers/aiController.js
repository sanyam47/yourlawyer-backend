import { askAI } from "../services/aiService.js";

export const testAIController = async (req, res) => {
  try {
    const reply = await askAI(
      "Explain what a contract is in one simple sentence."
    );

    res.json({ success: true, reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "AI failed" });
  }
};
