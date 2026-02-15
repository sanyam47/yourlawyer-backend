import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export async function askAI({ summary, messages, documentContext }) {
  try {
    const systemPrompt = `
You are YourLawyer AI.
You explain legal topics clearly and professionally.
If document context is provided, prioritize it.
`;

    const formattedPrompt = `
${systemPrompt}

Conversation Summary:
${summary || "None"}

Relevant Document Context:
${documentContext || "No documents attached."}

Recent Conversation:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

AI:
`;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: formattedPrompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("AI error:", error);
    throw error;
  }
}
