

type Message = {
    role: string;
    content: string;
};

export async function askGemini(messages: Message[]) {
    const response = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages })
    });

    const data = await response.json();
    return data ?? [];
}