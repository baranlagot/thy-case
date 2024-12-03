// src/pages/api/extract.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { text } = req.body;

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
        res.status(200).json({ message: messageContent });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ message: 'Failed to get response from OpenAI API' });
    }
}