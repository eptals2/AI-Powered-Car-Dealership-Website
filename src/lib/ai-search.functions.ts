import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { CAR_ASSISTANT_SYSTEM_PROMPT } from "@/ai/prompts/carAssistantPrompt-v1";

export const aiCarSearch = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) => {
    if (!input?.query || typeof input.query !== "string") throw new Error("Invalid query");
    const q = input.query.trim().slice(0, 500);
    if (!q) throw new Error("Empty query");
    return { query: q };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
    );
    const { data: cars } = await supabase
      .from("cars")
      .select("name, price, status, description")
      .limit(50);

    const list = (cars ?? [])
      .map((c, i) => `${i + 1}. ${c.name} — PHP ${c.price} (${c.status})${c.description ? " — " + String(c.description).slice(0, 120) : ""}`)
      .join("\n");

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              CAR_ASSISTANT_SYSTEM_PROMPT,
          },
          {
          },
          {
            role: "user",
            content: `Inventory:\n${list || "(no cars listed)"}\n\nCustomer question: ${data.query}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI error: ${res.status} ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = json.choices?.[0]?.message?.content ?? "Sorry, no answer.";
    return { reply };
  });
