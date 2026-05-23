import { relations } from "drizzle-orm";
import { cities, neighborhoods, listings, amenities, listingAmenities, tourRequests } from "./schema";

export const citiesRelations = relations(cities, ({ many }) => ({
  neighborhoods: many(neighborhoods),
}));

export const neighborhoodsRelations = relations(neighborhoods, ({ one, many }) => ({
  city: one(cities, {
    fields: [neighborhoods.cityId],
    references: [cities.id],
  }),
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  neighborhood: one(neighborhoods, {
    fields: [listings.neighborhoodId],
    references: [neighborhoods.id],
  }),
  amenityLinks: many(listingAmenities),

  tourRequests: many(tourRequests),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  listingLinks: many(listingAmenities),
}));

export const listingAmenitiesRelations = relations(listingAmenities, ({ one }) => ({
  listing: one(listings, {
    fields: [listingAmenities.listingId],
    references: [listings.id],
  }),
  amenity: one(amenities, {
    fields: [listingAmenities.amenityId],
    references: [amenities.id],
  }),
}));


export const tourRequestsRelations = relations(tourRequests, ({ one }) => ({
  listing: one(listings, {
    fields: [tourRequests.listingId],
    references: [listings.id],
  }),
}));
