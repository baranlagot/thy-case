// src/pages/api/chat.ts
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export async function POST(req: Request) {
    const { messages, menuItems } = await req.json();
    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                ...messages,
                { role: "system", content: `You are a helpful bot, helping with information about these food items on the menu: ${menuItems.join(', ')}. Keep the answer as short and minimal as possible and use the messaged language in your answer` }
            ],
            max_tokens: 300,
        });
        const messageContent = result.choices[0]?.message?.content?.trim();
        return new Response(JSON.stringify({ message: messageContent }));
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to get message" }));
    }
}