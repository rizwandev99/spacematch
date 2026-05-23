import { streamText, tool, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({ path: ".env.local" });

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

async function check() {
  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: [{ role: 'user', content: 'hello' }],
    maxSteps: 3,
    tools: {
      test: tool({
        description: 'test',
        parameters: z.object({}),
        execute: async () => { return "tested"; }
      })
    }
  });

  console.log(typeof result.toDataStreamResponse);
  console.log(typeof result.toTextStreamResponse);
}
check().catch(console.error);
