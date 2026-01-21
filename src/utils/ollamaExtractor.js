export async function extractTimelineFromText(text) {
  try {
    const prompt = `
You are an information extraction system.

Extract timeline event information from the text below.

Return ONLY valid JSON (no explanation, no markdown) with fields:
{
  "title": string,
  "date": string (ISO format yyyy-mm-dd or null),
  "status": "upcoming" | "completed" | "missed",
  "notes": string
}

If no timeline event exists, return:
null

Text:
"${text}"
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!data.response) return null;

    const cleaned = data.response.trim();

    if (cleaned === "null") return null;

    const parsed = JSON.parse(cleaned);

    if (!parsed.title || !parsed.date) return null;

    return parsed;
  } catch (error) {
    console.error("❌ Ollama extraction failed:", error);
    return null;
  }
}
