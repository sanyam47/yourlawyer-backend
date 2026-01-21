import fetch from "node-fetch";

const SERP_API_KEY = process.env.SERP_API_KEY;

export async function searchWeb(query) {
  const params = new URLSearchParams({
    engine: "google",
    q: query + " property dispute india",
    hl: "en",
    gl: "in",
    num: "5",
    api_key: SERP_API_KEY,
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  const res = await fetch(url);
  const data = await res.json();

  // 🔴 FULL DEBUG (IMPORTANT)
  console.log("🧪 FULL SERP RESPONSE:", JSON.stringify(data, null, 2));

  return (data.organic_results || []).map((r) => ({
    title: r.title,
    snippet: r.snippet,
    link: r.link,
  }));
}
