import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export async function askAI(prompt) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",   // or "llama3"
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Ollama Error:", data);
      throw new Error("Ollama failed");
    }

    return data.response;
  } catch (error) {
    console.error("❌ Local AI Error:", error.message);
    throw error;
  }
}
