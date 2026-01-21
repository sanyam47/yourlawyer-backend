import { askAI } from "./aiService.js";

export const analyzeDocumentWithAI = async (documentText) => {
  const prompt = `
You are an expert Indian contract and legal document analyst.

CRITICAL INSTRUCTION:
You MUST respond ONLY in valid JSON.
DO NOT include markdown, bullet points, explanations, or extra text.
DO NOT write anything outside JSON.
If JSON format is broken, the response is INVALID.

JSON FORMAT REQUIRED:

{
  "summary": "",
  "key_clauses": [
    {
      "page": "",
      "clause_text": "",
      "impact": "ADVANTAGE | RISK | LEGAL OBLIGATION",
      "explanation": ""
    }
  ],
  "overall_risk_level": "LOW | MEDIUM | HIGH",
  "legal_advice_note": ""
}

LEGAL RULES:
- Apply Indian civil law only.
- Focus on Indian Contract Act, 1872 and rental principles.
- Clearly state whether each clause benefits the user or can be used against them.
- Use simple language for a non-lawyer.

DOCUMENT:
${documentText}
`;

  console.log("🔥 USING CONTRACT-ONLY LEGAL PROMPT (NO IPC)");

  return await askAI(prompt);
};
