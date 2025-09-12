// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userInput, kbRules, kbSnippet } = req.body;

  // Store keys safely in serverless backend
  const GEMINI_API_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ];

  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const key = GEMINI_API_KEYS[i];
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `
SYSTEM INSTRUCTIONS:
You are Grocify's virtual assistant.
Always interpret "website", "project", "platform", "site", or "bot" as referring to Grocify.

RULES:
${kbRules}

DOCUMENT CONTEXT:
${kbSnippet}
                    `,
                  },
                ],
              },
              {
                role: "user",
                parts: [{ text: `User Question: ${userInput}` }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(`Gemini response (Key ${i + 1}):`, data);

      // If rate limited, try next key
      if (data?.error?.code === 429) {
        console.warn(`Key ${i + 1} hit rate limit, trying next...`);
        continue;
      }

      // If bad request, skip
      if (data?.error?.code === 400) {
        console.warn(`Key ${i + 1} returned bad request, trying next...`);
        continue;
      }

      // If success → return response to frontend
      return res.status(200).json({
        text:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I don't have specific information about that. I can respond only about our grocery website.",
      });
    } catch (error) {
      console.error(`Error with Key ${i + 1}:`, error);
      continue; // try next key
    }
  }

  // If all keys fail
  return res.status(500).json({
    text: "⚠️ Too many requests. Please try again in a few seconds or ask another question.",
  });
}
