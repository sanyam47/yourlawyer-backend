import fetch from "node-fetch";

export const generateTemplateAI = async ({ type, details }) => {
  try {
    const prompt = `
You are a professional legal assistant.

Generate a formal legal document.

Template Type:
${type}

Details:
${details}

Make it legally structured, clear, and professional.
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",     // ✅ change if you use another model
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!data.response) {
      throw new Error("No response from Ollama");
    }

    return data.response;
  } catch (error) {
    console.error("❌ Ollama Template Error:", error);
    throw new Error("AI template generation failed");
  }
};
