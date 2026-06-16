import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

type AiGatewayResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export const Route = createFileRoute("/api/ai-car-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { query?: unknown } | null;
        const query = typeof body?.query === "string" ? body.query.trim().slice(0, 500) : "";

        if (!query) {
          return Response.json({ error: "Please enter a question first." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          console.error("[ai-car-search] Missing GEMINI_API_KEY runtime secret");
          return Response.json({ error: "AI is not configured yet. Please try again shortly." }, { status: 500 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        let inventory = "";
        let allCars: any[] = [];

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: cars, error } = await supabase
            .from("cars")
            .select("*")
            .limit(50);

          if (error) console.error("[ai-car-search] Inventory read failed", error.message);

          allCars = cars ?? [];
          inventory = allCars
            .map((car, index) => {
              const description = car.description ? ` — ${String(car.description).slice(0, 120)}` : "";
              return `[${index + 1}] id=${car.id} | ${car.name} — PHP ${car.price} (${car.status})${description}`;
            })
            .join("\n");
        }

        const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  'You are a friendly car-buying assistant for Eric Car Trading in the Philippines. Recommend cars only from the provided inventory. Respond ONLY with a valid JSON object of shape {"reply": string, "car_ids": string[]} where reply is a short friendly message (max 3 sentences) and car_ids lists the ids of up to 4 matching cars from the inventory, ordered by best fit. If nothing matches, return the closest options.',
              },
              {
                role: "user",
                content: `Inventory:\n${inventory || "(no cars listed)"}\n\nCustomer question: ${query}`,
              },
            ],
          }),
        });

        if (!aiResponse.ok) {
          const details = await aiResponse.text();
          console.error("[ai-car-search] AI gateway error", aiResponse.status, details.slice(0, 500));

          if (aiResponse.status === 429) {
            return Response.json({ error: "AI is receiving too many requests. Please try again later." }, { status: 429 });
          }
          if (aiResponse.status === 402) {
            return Response.json({ error: "AI credits are unavailable right now. Please check your workspace billing." }, { status: 402 });
          }

          return Response.json({ error: "AI is unavailable right now. Please try again later." }, { status: 500 });
        }

        const json = (await aiResponse.json()) as AiGatewayResponse;
        const content = json.choices?.[0]?.message?.content ?? "";

        let reply = content;
        let carIds: string[] = [];
        try {
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed === "object") {
            if (typeof parsed.reply === "string") reply = parsed.reply;
            if (Array.isArray(parsed.car_ids)) {
              carIds = parsed.car_ids.filter((x: unknown): x is string => typeof x === "string");
            }
          }
        } catch {
          // fall back to raw text
        }

        const idSet = new Set(carIds);
        const matchedCars = allCars
          .filter((c) => idSet.has(c.id))
          .sort((a, b) => carIds.indexOf(a.id) - carIds.indexOf(b.id));

        return Response.json({ reply: reply || "Sorry, no answer.", cars: matchedCars });
      },
    },
  },
});
