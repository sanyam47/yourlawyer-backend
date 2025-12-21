import OpenAI from "openai";

export const generateTemplateAI = async (type, details) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Generate a professional legal ${type}.
Details:
${details || "Standard Indian legal format"}

Use clear clauses and headings.
Do not include explanations.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
