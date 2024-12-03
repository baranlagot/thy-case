// src/pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { messages, menuText } = req.body;

    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                ...messages,
                { role: "system", content: `You are a helpful bot, helping with information about these food items on the menu: ${menuText.join(', ')}. Keep the answer as short and minimal as possible` }
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