import type {
  AiGatewayResponse,
  RecommendationResponse,
} from "../types/ai.types";

export async function askGemini(
  inventory: string,
  query: string,
  systemPrompt: string
): Promise<RecommendationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash-lite",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Inventory:
${inventory}

Customer Question:
${query}`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Gemini Error ${response.status}: ${text.slice(0, 300)}`
    );
  }

  const json = (await response.json()) as AiGatewayResponse;

  const content =
    json.choices?.[0]?.message?.content ??
    '{"reply":"Sorry, no answer.","car_ids":[]}';

  return JSON.parse(content);
}