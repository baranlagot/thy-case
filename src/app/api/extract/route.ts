// src/pages/api/extract.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export async function POST(req: Request) {
    const { text, language } = await req.json();
    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Extract the list of menu items in english from the following text, take the context of the whole text first, don't try to take individual words only. then write these down, translating them to ${language} separating each individual food item with an underscore. Don't add extra wording other than the answer:\n\n${text}` }
            ],
            max_tokens: 300,
        });
        const messageContent = result.choices[0]?.message?.content?.trim();
        return new Response(JSON.stringify({ message: messageContent }));
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to get message" }));
    }
}
