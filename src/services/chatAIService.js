import OpenAI from "openai";

export const chatWithAI = async (userMessage) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful legal assistant. Answer clearly and simply. Do not provide illegal advice.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return response.choices[0].message.content;
};
