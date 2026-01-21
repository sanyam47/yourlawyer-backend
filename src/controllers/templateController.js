import { generateTemplateAI } from "../services/templateAIService.js";

export const generateTemplate = async (req, res) => {
  try {
    const { type, details } = req.body;

    if (!type || !details) {
      return res.status(400).json({ message: "Missing template data" });
    }

    const template = await generateTemplateAI({ type, details });

    res.status(200).json({ template });
  } catch (error) {
    console.error("❌ Template Controller Error:", error);
    res.status(500).json({ message: "Template generation failed" });
  }
};
