import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { searchListingsSchema } from "@/lib/ai-tools";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { listings, neighborhoods, cities } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

const MAX_RESULTS = 10;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful office space search assistant. You help startup teams find office space in San Francisco, New York, and Boston.

When a user describes what they need, use the searchListings tool to find matching offices. Then explain why each result is a good match based on their requirements.

Be concise and friendly. If you're not sure about something, ask. Don't make up information about listings that weren't returned by the tool.

When presenting results, mention the listing name, neighborhood, price, size, and why it matches. Use bullet points for clarity.`,
    messages,
    tools: {
      searchListings: tool({
        description: "Search for office space listings based on user requirements like city, budget, team size, and amenities",
        parameters: searchListingsSchema,
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
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
