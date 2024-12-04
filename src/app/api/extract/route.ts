// src/pages/api/extract.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export async function POST(req: Request) {
    const { text } = await req.json();
    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Extract the list of food items in english from the following text, then write these down separating each individual food item with an underscore. Don't add extra wording other than the answer:\n\n${text}` }
            ],
            max_tokens: 300,
        });
        const messageContent = result.choices[0]?.message?.content?.trim();
        return new Response(JSON.stringify({ message: messageContent }));
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to get message" }));
    }
}
