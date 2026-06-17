import type {
  AiGatewayResponse,
  RecommendationResponse,
} from "../types/ai.types";

const MODELS = [
  "gemma-4-26b",
  "gemma-4-31b",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2-flash",
  "gemini-2-flash-lite",
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
];

export async function askGemini(
  inventory: string,
  query: string,
  systemPrompt: string
): Promise<RecommendationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
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

        console.error(
          `[AI] ${model} failed with ${response.status}`
        );

        // Fallback to next model for quota/server issues
        if (
          response.status === 429 ||
          response.status === 500 ||
          response.status === 502 ||
          response.status === 503
        ) {
          lastError = new Error(
            `${model}: ${response.status}`
          );
          continue;
        }

        throw new Error(
          `${model}: ${response.status} ${text.slice(0, 300)}`
        );
      }

      const json = (await response.json()) as AiGatewayResponse;

      const content =
        json.choices?.[0]?.message?.content ??
        '{"reply":"Sorry, no answer.","car_ids":[]}';

      try {
        const parsed = JSON.parse(content);

        console.log(`[AI] Success using ${model}`);

        return {
          reply: parsed.reply ?? "Sorry, no answer.",
          car_ids: Array.isArray(parsed.car_ids)
            ? parsed.car_ids
            : [],
        };
      } catch (parseError) {
        console.error(
          `[AI] Invalid JSON from ${model}`,
          content
        );

        lastError =
          parseError instanceof Error
            ? parseError
            : new Error(String(parseError));

        continue;
      }
    } catch (error) {
      console.error(
        `[AI] ${model} error`,
        error
      );

      lastError =
        error instanceof Error
          ? error
          : new Error(String(error));
    }
  }

  throw (
    lastError ??
    new Error("All Gemini models failed")
  );
}