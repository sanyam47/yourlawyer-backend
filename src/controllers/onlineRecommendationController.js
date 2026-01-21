import { searchWeb } from "../services/webSearchService.js";
import { analyzeOnlineCases } from "../services/onlineAnalysisService.js";

export const getOnlineRecommendations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    // 🔍 Step 1: Fetch similar cases from web
    const sources = await searchWeb(query);

    // 🧠 Step 2: Ask AI to analyze ONLY these sources
    const groundedSuggestion = await analyzeOnlineCases(query, sources);

    // ✅ Step 3: Return both sources + grounded AI output
    res.json({
      sources,
      suggestion: groundedSuggestion,
    });
  } catch (err) {
    console.error("Online recommendation error:", err);
    res.status(500).json({ message: "Online recommendation failed" });
  }
};
