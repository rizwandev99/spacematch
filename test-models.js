import { google } from "@ai-sdk/google";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function check() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("No API key");
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  const models = data.models.map(m => m.name).filter(m => m.includes("gemini"));
  console.log("AVAILABLE MODELS:", models);
}

check().catch(console.error);
