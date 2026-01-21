import express from "express";
import fetch from "node-fetch";
import dns from "dns/promises";

const router = express.Router();

/* ======================================================
   🌐 CHECK INTERNET CONNECTIVITY
====================================================== */

async function hasInternet() {
  try {
    await dns.lookup("google.com");
    return true;
  } catch {
    return false;
  }
}

/* ======================================================
   🧠 OLLAMA GENERATOR (OFFLINE)
====================================================== */

async function generateWithOllama(prompt) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",   // ✅ you already have this
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama not reachable");
  }

  const text = await response.text();
  const data = JSON.parse(text);
  return data.response;
}

/* ======================================================
   🤖 OPENAI GENERATOR (ONLINE)
====================================================== */

async function generateWithOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a legal drafting assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();

  if (!data.choices) {
    throw new Error("OpenAI response invalid");
  }

  return data.choices[0].message.content;
}

/* ======================================================
   🤖 SMART AI ROUTE (AUTO SWITCH)
====================================================== */

router.post("/ai-generate", async (req, res) => {
  try {
    const { documentType, values } = req.body;

    if (!documentType || !values) {
      return res.status(400).json({
        error: "Missing documentType or values",
      });
    }

    const prompt = `
You are a professional legal drafting assistant.

Generate a complete ${documentType} legal agreement using the following information:

${JSON.stringify(values, null, 2)}

Rules:
- Use formal legal language
- Add headings and clauses
- Do NOT use placeholders
- Make it ready for signing
`;

    const online = await hasInternet();

    console.log("🌐 Internet Available:", online);

    let draft;

    if (online) {
      console.log("🚀 Using OpenAI");
      draft = await generateWithOpenAI(prompt);
    } else {
      console.log("🖥️ Using Ollama (Offline)");
      draft = await generateWithOllama(prompt);
    }

    res.json({
      mode: online ? "online-openai" : "offline-ollama",
      draft,
    });
  } catch (err) {
    console.error("❌ AI generation error:", err.message);
    res.status(500).json({
      error: "AI generation failed",
    });
  }
});

export default router;
