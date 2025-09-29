import knowledgeBase from "../../Chatbot/knowledgeBase.js"; 

// Helper: decide which KB snippet to include based on user input
function getRelevantKBSnippet(userMessage) {
  const msg = userMessage.toLowerCase();
  const snippets = [];

  if (msg.includes("payment") || msg.includes("pay")) snippets.push(knowledgeBase.examples.payment);
  if (msg.includes("delivery") || msg.includes("ship") || msg.includes("order")) snippets.push(knowledgeBase.examples.delivery);
  if (msg.includes("return") || msg.includes("refund")) snippets.push(knowledgeBase.examples.returns);
  if (msg.includes("support") || msg.includes("help") || msg.includes("contact")) snippets.push(knowledgeBase.examples.support);
  if (msg.includes("who made") || msg.includes("creator") || msg.includes("built") || msg.includes("author")) snippets.push(knowledgeBase.examples.creator);
  if (msg.includes("technology") || msg.includes("tech") || msg.includes("framework") || msg.includes("tool")) snippets.push(knowledgeBase.examples.tech);
  if (msg.includes("products") || msg.includes("items") || msg.includes("sell") || msg.includes("groceries") || msg.includes("offer")) snippets.push(knowledgeBase.examples.products);

  // Always include default context if nothing matched
  if (snippets.length === 0) snippets.push(knowledgeBase.context);

  return snippets.join("\n\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userInput } = req.body; // ✅ only userInput comes from client

  // Store keys safely in backend
  const GEMINI_API_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ];

  // Build system prompt hidden in backend
  const systemPrompt = `
SYSTEM INSTRUCTIONS:
You are Grocify's virtual assistant.  
Always interpret "website", "project", "platform", "site", or "bot" as Grocify.  
Use the knowledge base below for products, delivery, payment, support, company info, and technologies.  
Be polite, clear, and professional when answering business questions.  
If the user goes off-topic, personal, or casual, respond naturally and with light humor — not a fixed fallback.

RULES:
${knowledgeBase.rules}

DOCUMENT CONTEXT:
${getRelevantKBSnippet(userInput)}
`;

  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const key = GEMINI_API_KEYS[i];
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "system", parts: [{ text: systemPrompt }] },
              { role: "user", parts: [{ text: `User Question: ${userInput}` }] },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(`Gemini response (Key ${i + 1}):`, data);

      if (data?.error?.code === 429) {
        console.warn(`Key ${i + 1} hit rate limit, trying next...`);
        continue;
      }

      if (data?.error?.code === 400) {
        console.warn(`Key ${i + 1} returned bad request, trying next...`);
        continue;
      }

      return res.status(200).json({
        text:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I don't have specific information about that. I can respond only about our grocery website.",
      });
    } catch (error) {
      console.error(`Error with Key ${i + 1}:`, error);
      continue;
    }
  }

  return res.status(500).json({
    text: "⚠️ Too many requests. Please try again in a few seconds or ask another question.",
  });
}
