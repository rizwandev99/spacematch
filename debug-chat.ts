import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool } from "ai";
import * as dotenv from 'dotenv';
import { searchListingsSchema } from "./src/lib/ai-tools";
dotenv.config({ path: '.env.local' });

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const messages = [{ role: "user", content: "I need an office for 10 people in SF, dog friendly under $10k/mo" }] as any;

  try {
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a helpful office space search assistant...`,
      messages: convertToModelMessages(messages),
      tools: {
        searchListings: tool({
          description: "Search for office space listings...",
          parameters: searchListingsSchema,
          execute: async () => []
        })
      },
      maxSteps: 3,
    });

    console.log("stream started...");
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
}

main();
