import { askAI } from "./aiService.js";

export const analyzeDocumentWithAI = async (documentText) => {
  const prompt = `
You are a legal document analysis assistant.

Analyze the following document and provide:

1. Brief summary (5–6 lines)
2. Important clauses (bullet points)
3. Potential legal risks or concerns
4. Simple explanation for a non-lawyer

Rules:
- Do NOT give legal advice
- Do NOT assume facts not in the document
- Be clear and structured

DOCUMENT:
${documentText}
`;

  return await askAI(prompt);
};
