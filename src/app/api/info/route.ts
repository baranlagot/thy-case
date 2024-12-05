// app/api/food-details/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { foodName } = await req.json();
    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { 
                    role: "system", 
                    content: "You are a nutrition expert. Provide food information in JSON format."
                },
                { 
                    role: "user", 
                    content: `Provide detailed information about ${foodName} in the following JSON format:
                    {
                        "name": "food name",
                        "description": "brief description",
                        "nutrition": {
                            "calories": number,
                            "protein": number,
                            "carbs": number,
                            "fat": number
                        }
                    }`
                }
            ],
            max_tokens: 500,
        });

        const messageContent = result.choices[0]?.message?.content;
        const foodData = JSON.parse(messageContent || "{}");
        return new Response(JSON.stringify(foodData));
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to get food details" }));
    }
}