import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, convertToModelMessages } from "ai";
import { searchListingsSchema } from "@/lib/ai-tools";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { listings, neighborhoods, cities } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

const MAX_RESULTS = 10;

const SYSTEM_PROMPT = [
  "You are a helpful office space search assistant. You help startup teams find office space in San Francisco, New York, and Boston.",
  "",
  "When a user describes what they need, call the searchListings tool EXACTLY ONCE to find matching offices. After you receive the tool results, immediately write your final response — do NOT call any tool again.",
  "",
  "Be concise and friendly. If you're not sure about something, ask. Don't make up information about listings that weren't returned by the tool.",
  "",
  "When presenting results or answering follow-up questions about listings, you MUST format each listing's name as a clickable Markdown link: [Title](/listings/slug). Do NOT include any image markdown or image URLs in your response.",
].join("\n");

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("REQUEST BODY:", JSON.stringify(body, null, 2));
  const messages = Array.isArray(body.messages) ? body.messages : [];

  // If the conversation already contains tool results, force the model to
  // produce a text response — this breaks the infinite tool-call loop that
  // occurs when the frontend fires a follow-up request after each tool step.
  const hasToolResults = messages.some(
    (m: any) =>
      Array.isArray(m.parts) &&
      m.parts.some((p: any) => typeof p.type === "string" && p.type.startsWith("tool-"))
  );

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  try {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      toolChoice: hasToolResults ? "none" : "auto",

      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: {
        searchListings: tool({
          description: "Search for office space listings based on user requirements like city, budget, team size, and amenities",
          inputSchema: searchListingsSchema,
          execute: async (params) => {
            const conditions = [eq(listings.isAvailable, true)];

            if (params.maxBudget) {
              conditions.push(lte(listings.pricePerMonth, params.maxBudget * 100));
            }
            if (params.minBudget) {
              conditions.push(gte(listings.pricePerMonth, params.minBudget * 100));
            }
            if (params.minDesks) {
              conditions.push(gte(listings.maxDesks, params.minDesks));
            }
            if (params.maxDesks) {
              conditions.push(lte(listings.minDesks, params.maxDesks));
            }
            if (params.petFriendly) {
              conditions.push(eq(listings.petFriendly, true));
            }
            if (params.hasParking) {
              conditions.push(eq(listings.hasParking, true));
            }

            let query = db
              .select({
                id: listings.id,
                title: listings.title,
                slug: listings.slug,
                description: listings.description,
                sqft: listings.sqft,
                pricePerMonth: listings.pricePerMonth,
                minDesks: listings.minDesks,
                maxDesks: listings.maxDesks,
                leaseTerm: listings.leaseTerm,
                petFriendly: listings.petFriendly,
                hasParking: listings.hasParking,
                hasNaturalLight: listings.hasNaturalLight,
                neighborhood: neighborhoods.name,
                city: cities.name,
                imageUrl: listings.imageUrl,
              })
              .from(listings)
              .innerJoin(neighborhoods, eq(listings.neighborhoodId, neighborhoods.id))
              .innerJoin(cities, eq(neighborhoods.cityId, cities.id))
              .where(and(...conditions))
              .orderBy(desc(listings.createdAt))
              .limit(MAX_RESULTS);

            // filter by city name if provided
            if (params.city) {
              query = db
                .select({
                  id: listings.id,
                  title: listings.title,
                  slug: listings.slug,
                  description: listings.description,
                  sqft: listings.sqft,
                  pricePerMonth: listings.pricePerMonth,
                  minDesks: listings.minDesks,
                  maxDesks: listings.maxDesks,
                  leaseTerm: listings.leaseTerm,
                  petFriendly: listings.petFriendly,
                  hasParking: listings.hasParking,
                  hasNaturalLight: listings.hasNaturalLight,
                  neighborhood: neighborhoods.name,
                  city: cities.name,
                  imageUrl: listings.imageUrl,
                })
                .from(listings)
                .innerJoin(neighborhoods, eq(listings.neighborhoodId, neighborhoods.id))
                .innerJoin(cities, eq(neighborhoods.cityId, cities.id))
                .where(
                  and(
                    ...conditions,
                    eq(cities.name, params.city)
                  )
                )
                .orderBy(desc(listings.createdAt))
                .limit(MAX_RESULTS);
            }

            const results = await query;

            // convert price from cents to dollars for the AI
            return results.map((r) => ({
              ...r,
              pricePerMonth: r.pricePerMonth / 100,
            }));
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error);
    return new Response(JSON.stringify({ 
      error: error.message, 
      stack: error.stack,
      messagesIsArray: Array.isArray(messages),
      messagesString: JSON.stringify(messages)
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
