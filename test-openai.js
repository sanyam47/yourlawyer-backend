import fetch from "node-fetch";

if (!process.env.OPENAI_API_KEY) {
  console.log("❌ OPENAI_API_KEY not found in environment");
  process.exit(1);
}

const response = await fetch("https://api.openai.com/v1/models", {
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

const data = await response.json();
console.log("✅ OpenAI response:");
console.log(data);
