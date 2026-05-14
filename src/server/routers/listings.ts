import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { listings, neighborhoods, cities, listingAmenities, amenities } from "@/db/schema";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

export const listingsRouter = router({
  getAll: publicProcedure
    .input(z.object({
      city: z.string().optional(),
      sort: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      const filters = input || {};

      // build where conditions
      const conditions = [];
      if (filters.minPrice) {
        conditions.push(gte(listings.pricePerMonth, filters.minPrice));
      }
      if (filters.maxPrice) {
        conditions.push(lte(listings.pricePerMonth, filters.maxPrice));
      }

      console.log("fetching listings with filters:", filters);

      let query = db.select({
        id: listings.id,
        title: listings.title,
        slug: listings.slug,
        address: listings.address,
        description: listings.description,
        sqft: listings.sqft,
        pricePerMonth: listings.pricePerMonth,
        minDesks: listings.minDesks,
        maxDesks: listings.maxDesks,
        leaseTerm: listings.leaseTerm,
        imageUrl: listings.imageUrl,
        petFriendly: listings.petFriendly,
        hasNaturalLight: listings.hasNaturalLight,
        hasParking: listings.hasParking,
        floorLevel: listings.floorLevel,
        neighborhood: neighborhoods.name,
        neighborhoodSlug: neighborhoods.slug,
        city: cities.name,
        citySlug: cities.slug,
      })
      .from(listings)
      .innerJoin(neighborhoods, eq(listings.neighborhoodId, neighborhoods.id))
      .innerJoin(cities, eq(neighborhoods.cityId, cities.id))
      .where(
        and(
          eq(listings.isAvailable, true),
          ...(filters.city ? [eq(cities.slug, filters.city)] : []),
          ...conditions,
        )
      );

      // sorting
      let results;
      if (filters.sort === "price-asc") {
        results = await query.orderBy(asc(listings.pricePerMonth));
      } else if (filters.sort === "price-desc") {
        results = await query.orderBy(desc(listings.pricePerMonth));
      } else if (filters.sort === "size-desc") {
        results = await query.orderBy(desc(listings.sqft));
      } else {
        results = await query.orderBy(desc(listings.createdAt));
      }

      return results;
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const result = await db.select({
        id: listings.id,
        title: listings.title,
        slug: listings.slug,
        address: listings.address,
        description: listings.description,
        sqft: listings.sqft,
        pricePerMonth: listings.pricePerMonth,
        minDesks: listings.minDesks,
        maxDesks: listings.maxDesks,
        leaseTerm: listings.leaseTerm,
        imageUrl: listings.imageUrl,
        petFriendly: listings.petFriendly,
        hasNaturalLight: listings.hasNaturalLight,
        hasParking: listings.hasParking,
        floorLevel: listings.floorLevel,
        yearBuilt: listings.yearBuilt,
        neighborhood: neighborhoods.name,
        neighborhoodSlug: neighborhoods.slug,
        city: cities.name,
        citySlug: cities.slug,
        transitScore: neighborhoods.transitScore,
      })
      .from(listings)
      .innerJoin(neighborhoods, eq(listings.neighborhoodId, neighborhoods.id))
      .innerJoin(cities, eq(neighborhoods.cityId, cities.id))
      .where(eq(listings.slug, input))
      .limit(1);

      if (!result[0]) return null;

      // get amenities for this listing
      const listingAmens = await db.select({
        name: amenities.name,
        icon: amenities.icon,
      })
      .from(listingAmenities)
      .innerJoin(amenities, eq(listingAmenities.amenityId, amenities.id))
      .where(eq(listingAmenities.listingId, result[0].id));

      return {
        ...result[0],
        amenities: listingAmens,
      };
    }),
});
