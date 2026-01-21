import { askAI } from "./aiService.js";

export const analyzeDocumentWithAI = async (documentText) => {
  const prompt = `
You are an expert Indian legal assistant and contract analyst.

Analyze the following legal document and provide a structured response.

IMPORTANT RULES:
- Refer ONLY to Indian law.
- If relevant, mention Indian Penal Code (IPC) sections.
- Use simple language for a non-lawyer.
- If exact IPC section is uncertain, say "Potentially applicable IPC section".

OUTPUT FORMAT (STRICT JSON):

{
  "summary": "Plain English summary of the document",
  "key_clauses": [
    {
      "page": "page number if available",
      "clause_text": "important line or clause",
      "ipc_section": "IPC section number and title",
      "impact": "ADVANTAGE | RISK",
      "explanation": "Why this helps or can be used against the user"
    }
  ],
  "overall_risk_level": "LOW | MEDIUM | HIGH",
  "legal_advice_note": "This is AI-generated legal analysis and not a substitute for a licensed lawyer"
}

DOCUMENT TEXT:
${documentText}
`;


  return await askAI(prompt);
};
