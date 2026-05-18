import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { tourRequests } from "@/db/schema";

export const toursRouter = router({
  requestTour: publicProcedure
    .input(z.object({
      listingId: z.number(),
      name: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      teamSize: z.number().optional(),
      message: z.string().optional(),
      preferredDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [result] = await db.insert(tourRequests).values({
        listingId: input.listingId,
        name: input.name,
        email: input.email,
        company: input.company || null,
        teamSize: input.teamSize || null,
        message: input.message || null,
        preferredDate: input.preferredDate || null,
      }).returning();

      return result;
    }),
});
