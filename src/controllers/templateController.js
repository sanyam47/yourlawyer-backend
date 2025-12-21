import { generateTemplateAI } from "../services/templateAIService.js";

export const generateTemplate = async (req, res) => {
  try {
    const { type, details } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Template type is required" });
    }

    const result = await generateTemplateAI(type, details);

    res.json({ template: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Template generation failed" });
  }
};
