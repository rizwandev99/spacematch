import { pgTable, serial, varchar, text, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";

// cities
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

// neighborhoods
export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  transitScore: integer("transit_score"),
});

// office listings
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  neighborhoodId: integer("neighborhood_id").references(() => neighborhoods.id).notNull(),
  address: varchar("address", { length: 300 }),
  description: text("description").notNull(),
  sqft: integer("sqft").notNull(),
  pricePerMonth: integer("price_per_month").notNull(), // stored in cents
  minDesks: integer("min_desks").notNull(),
  maxDesks: integer("max_desks").notNull(),
  leaseTerm: varchar("lease_term", { length: 50 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  isAvailable: boolean("is_available").default(true),
  petFriendly: boolean("pet_friendly").default(false),
  hasNaturalLight: boolean("has_natural_light").default(true),
  hasParking: boolean("has_parking").default(false),
  floorLevel: integer("floor_level"),
  yearBuilt: integer("year_built"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// amenities
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }),
});

// listing <-> amenity join table
export const listingAmenities = pgTable("listing_amenities", {
  listingId: integer("listing_id").references(() => listings.id).notNull(),
  amenityId: integer("amenity_id").references(() => amenities.id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.listingId, table.amenityId] }),
}));


// tour requests
export const tourRequests = pgTable("tour_requests", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }),
  teamSize: integer("team_size"),
  message: text("message"),
  preferredDate: varchar("preferred_date", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
