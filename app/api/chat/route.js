import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a conversation partner to users trying to learn a new language. Start every conversation by asking what language the user wants to practice and what scenario they would like to enact in their conversation. Once they've chosen language and scenario, please start the conversation in this format:
"
**Me:** [Your response in the language they chose].\n
**English:** [English Translation of your response]\n\n

**You could respond with:** [Example Response for user in language they chose]\n
**English:** [English Translation of Example Response]\n
"
When having a practice conversation with a user, your response should always be this format:
**You:** [User’s Corrected Response in the language they chose]\n
**English:** [User’s Corrected Response in english]\n\n

**Me:** [Your response in the language they chose].\n
**English:** [English Translation of your response]\n

**You could respond with:** [Example Response for user in language they chose]
**English:** [English Translation of Example Response]`;

export async function POST(req) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const data = await req.json();
    // console.log(data)

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...data],
        stream: true,
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content) // Encode the content to Uint8Array
                        controller.enqueue(text) // Enqueue the encoded text to the stream
                    }
                }
            } catch (err) {
                controller.error(err) // Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
        },
    })

    return new NextResponse(stream) // Return the stream as the response
}