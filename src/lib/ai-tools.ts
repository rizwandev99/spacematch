import { z } from "zod";

// tool definition for AI to search listings
export const searchListingsSchema = z.object({
  city: z.string().optional().describe("City name: 'San Francisco', 'New York', or 'Boston'"),
  minBudget: z.number().optional().describe("Minimum monthly budget in dollars"),
  maxBudget: z.number().optional().describe("Maximum monthly budget in dollars"),
  minDesks: z.number().optional().describe("Minimum number of desks needed"),
  maxDesks: z.number().optional().describe("Maximum number of desks needed"),
  petFriendly: z.boolean().optional().describe("Whether the office needs to be pet friendly"),
  hasParking: z.boolean().optional().describe("Whether parking is required"),
  neighborhoods: z.array(z.string()).optional().describe("Preferred neighborhoods"),
});

export type SearchListingsInput = z.infer<typeof searchListingsSchema>;
