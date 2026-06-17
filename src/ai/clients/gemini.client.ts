export type GeminiMessage = {
    role: "system" | "user" | "assistant";
    content: string;
}

export type GeminiResponse = {
    reply: string;
}

export async function askGemini(
    apiKey: string,
    messages: GeminiMessage[],
    model: "gemini-2.5-flash"
): Promise<GeminiResponse> {
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages
            })
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return { reply: json.choices?.[0]?.message?.content ?? "Sorry, I didn't understand that." };
}