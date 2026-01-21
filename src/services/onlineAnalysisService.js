import { askAI } from "./aiService.js";

export async function analyzeOnlineCases(userCase, sources) {
  if (!sources || sources.length === 0) {
    return "No sufficient online sources found to generate grounded suggestions.";
  }

  const formattedSources = sources
    .map(
      (s, index) => `
Source ${index + 1}:
Title: ${s.title}
Snippet: ${s.snippet}
Link: ${s.link}
`
    )
    .join("\n");

  const prompt = `
You are a legal research assistant.

User Case:
"${userCase}"

Below are similar cases and articles found online:
${formattedSources}

Instructions:
1. Generate 3–5 practical legal strategy suggestions.
2. Each suggestion MUST clearly mention which Source number supports it.
3. Base suggestions ONLY on the provided sources.
4. Do NOT invent facts or laws.
5. Keep tone informational (not legal advice).
6. If sources are weak, say so honestly.

Format output clearly in bullet points.
`;

  return await askAI(prompt, "openai");
}
