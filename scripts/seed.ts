import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { cities, neighborhoods, amenities, listings, listingAmenities } from "../src/db/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("seeding database...");

  // clear existing data
  await db.delete(listingAmenities);
  await db.delete(listings);
  await db.delete(amenities);
  await db.delete(neighborhoods);
  await db.delete(cities);

  // cities
  const [sf, nyc, bos] = await db.insert(cities).values([
    { name: "San Francisco", state: "California", slug: "san-francisco" },
    { name: "New York", state: "New York", slug: "new-york" },
    { name: "Boston", state: "Massachusetts", slug: "boston" },
  ]).returning();

  // neighborhoods
  const hoods = await db.insert(neighborhoods).values([
    { name: "SOMA", cityId: sf.id, slug: "soma", transitScore: 92 },
    { name: "FiDi", cityId: sf.id, slug: "fidi", transitScore: 95 },
    { name: "Mission", cityId: sf.id, slug: "mission", transitScore: 88 },
    { name: "Potrero Hill", cityId: sf.id, slug: "potrero-hill", transitScore: 72 },
    { name: "Dogpatch", cityId: sf.id, slug: "dogpatch", transitScore: 68 },
    { name: "Hayes Valley", cityId: sf.id, slug: "hayes-valley", transitScore: 85 },
    { name: "Chelsea", cityId: nyc.id, slug: "chelsea", transitScore: 94 },
    { name: "Soho", cityId: nyc.id, slug: "soho", transitScore: 90 },
    { name: "Tribeca", cityId: nyc.id, slug: "tribeca", transitScore: 88 },
    { name: "Flatiron", cityId: nyc.id, slug: "flatiron", transitScore: 96 },
    { name: "Midtown", cityId: nyc.id, slug: "midtown", transitScore: 98 },
    { name: "Williamsburg", cityId: nyc.id, slug: "williamsburg", transitScore: 82 },
    { name: "Fort Point", cityId: bos.id, slug: "fort-point", transitScore: 78 },
    { name: "Seaport", cityId: bos.id, slug: "seaport", transitScore: 80 },
    { name: "Back Bay", cityId: bos.id, slug: "back-bay", transitScore: 92 },
    { name: "Kendall Square", cityId: bos.id, slug: "kendall-square", transitScore: 90 },
  ]).returning();

  const hoodMap: Record<string, number> = {};
  hoods.forEach(h => { hoodMap[h.slug] = h.id; });

  // amenities
  const amenityList = await db.insert(amenities).values([
    { name: "Private Boardroom", icon: "door-open" },
    { name: "Phone Booths", icon: "phone" },
    { name: "Full Kitchen", icon: "cooking-pot" },
    { name: "Bike Storage", icon: "bike" },
    { name: "Rooftop Access", icon: "sun" },
    { name: "Dog Friendly", icon: "dog" },
    { name: "24/7 Access", icon: "clock" },
    { name: "Mail Room", icon: "mail" },
    { name: "High-Speed Fiber", icon: "wifi" },
    { name: "Standing Desks", icon: "monitor" },
    { name: "Shower Facilities", icon: "droplets" },
    { name: "EV Charging", icon: "zap" },
    { name: "On-site Gym", icon: "dumbbell" },
    { name: "Mother's Room", icon: "baby" },
  ]).returning();

  // helper to get random amenity ids
  const pickAmenities = (count: number) => {
    const shuffled = [...amenityList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(a => a.id);
  };

  // images from unsplash
  const images = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
    "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&q=80",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80",
    "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80",
    "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80",
  ];

  const img = (i: number) => images[i % images.length];

  // listings data - this is kinda long but whatever
  const listingData = [
    { title: "The Clocktower Suite", slug: "clocktower-suite-soma", hood: "soma", address: "461 2nd St, San Francisco, CA", desc: "Stunning brick-and-beam office in a converted clocktower building. Original hardwood floors with exposed ductwork and soaring 16-ft ceilings. Two private conference rooms and a communal breakroom with espresso bar.", sqft: 3200, price: 1200000, minD: 10, maxD: 25, term: "6-24 months", img: img(0), pet: true, light: true, park: false, floor: 3, year: 1907 },
    { title: "Bright SOMA Loft", slug: "bright-soma-loft", hood: "soma", address: "155 5th St, San Francisco, CA", desc: "Sun-drenched open loft in the heart of SOMA. Floor to ceiling windows on two sides. Perfect for a small engineering team that wants to feel connected.", sqft: 1800, price: 720000, minD: 6, maxD: 14, term: "12 months", img: img(1), pet: false, light: true, park: false, floor: 4, year: 2001 },
    { title: "FiDi High-Rise Office", slug: "fidi-high-rise", hood: "fidi", address: "100 Pine St, San Francisco, CA", desc: "Premium high-rise office on the 22nd floor with panoramic views of the Bay Bridge. Recently renovated with modern finishes. Includes reception area and two phone booths.", sqft: 5500, price: 2800000, minD: 20, maxD: 45, term: "12-36 months", img: img(2), pet: false, light: true, park: true, floor: 22, year: 1975 },
    { title: "Historic FiDi Walk-Up", slug: "historic-fidi-walkup", hood: "fidi", address: "220 Montgomery St, San Francisco, CA", desc: "Charming walk-up office in a historic FiDi building. Original crown moldings and a wood-burning fireplace (decorative). Two blocks from Montgomery BART.", sqft: 2400, price: 960000, minD: 8, maxD: 18, term: "6-12 months", img: img(3), pet: true, light: true, park: false, floor: 2, year: 1923 },
    { title: "Mission Creative Hub", slug: "mission-creative-hub", hood: "mission", address: "3180 18th St, San Francisco, CA", desc: "Vibrant creative space in the Mission with a mural-covered exterior. Open floor plan with a large communal kitchen and outdoor patio. Great coffee shops nearby.", sqft: 2800, price: 840000, minD: 10, maxD: 22, term: "12 months", img: img(4), pet: true, light: true, park: false, floor: 1, year: 1985 },
    { title: "Potrero Hill Garden Office", slug: "potrero-hill-garden", hood: "potrero-hill", address: "1459 18th St, San Francisco, CA", desc: "Quiet ground-floor office with a private garden patio. Perfect for teams that want a calm environment away from downtown noise. Dog-friendly with a fenced yard area.", sqft: 1500, price: 600000, minD: 4, maxD: 10, term: "Month-to-Month", img: img(5), pet: true, light: true, park: true, floor: 1, year: 1992 },
    { title: "Dogpatch Warehouse", slug: "dogpatch-warehouse", hood: "dogpatch", address: "2525 3rd St, San Francisco, CA", desc: "Raw converted warehouse with industrial character. Polished concrete floors, 20-foot ceilings, and roll-up garage doors. Great for hardware or creative companies.", sqft: 4000, price: 1000000, minD: 15, maxD: 35, term: "12-24 months", img: img(6), pet: true, light: true, park: true, floor: 1, year: 1958 },
    { title: "Hayes Valley Boutique", slug: "hayes-valley-boutique", hood: "hayes-valley", address: "580 Hayes St, San Francisco, CA", desc: "Intimate boutique office above a retail space on Hayes Street. Beautifully finished with custom millwork and built-in shelving. Walk to Blue Bottle, Smitten, everything.", sqft: 1200, price: 540000, minD: 4, maxD: 8, term: "6-12 months", img: img(7), pet: false, light: true, park: false, floor: 2, year: 2010 },
    // NYC listings
    { title: "Chelsea Loft Suite", slug: "chelsea-loft-suite", hood: "chelsea", address: "220 W 19th St, New York, NY", desc: "Double-height ceilings in a classic Chelsea loft. Original cast-iron columns and timber beams. Freight elevator access and a full chef's kitchen on the floor.", sqft: 4500, price: 2200000, minD: 15, maxD: 40, term: "12-36 months", img: img(8), pet: false, light: true, park: false, floor: 5, year: 1910 },
    { title: "Soho Creative Loft", slug: "soho-creative-loft", hood: "soho", address: "435 Broome St, New York, NY", desc: "Iconic Soho loft with huge arched windows and original hardwood floors. Curated design throughout with custom furniture available. Three meeting nooks and a lounge area.", sqft: 3800, price: 2400000, minD: 12, maxD: 30, term: "12 months", img: img(9), pet: false, light: true, park: false, floor: 3, year: 1885 },
    { title: "Tribeca Corner Office", slug: "tribeca-corner-office", hood: "tribeca", address: "80 Leonard St, New York, NY", desc: "Corner unit with wraparound windows and views of the Hudson. Modern buildout with glass-walled conference room. Doorman building with 24/7 security.", sqft: 3200, price: 2000000, minD: 10, maxD: 25, term: "12-24 months", img: img(10), pet: true, light: true, park: false, floor: 8, year: 2005 },
    { title: "Flatiron Tech Floor", slug: "flatiron-tech-floor", hood: "flatiron", address: "115 E 23rd St, New York, NY", desc: "Full floor in a Flatiron tech building. Pre-wired for high density with redundant fiber. Server room and dedicated HVAC. Other tenants include two YC companies.", sqft: 6000, price: 3500000, minD: 25, maxD: 50, term: "24-36 months", img: img(11), pet: false, light: true, park: false, floor: 7, year: 1995 },
    { title: "Midtown Executive Suite", slug: "midtown-executive-suite", hood: "midtown", address: "1345 6th Ave, New York, NY", desc: "Plug-and-play executive suite near Rockefeller Center. Furnished with Herman Miller throughout. Shared reception and pantry. Best transit access in the city.", sqft: 2200, price: 1800000, minD: 8, maxD: 18, term: "6-12 months", img: img(12), pet: false, light: true, park: false, floor: 14, year: 1968 },
    { title: "Williamsburg Studio", slug: "williamsburg-studio", hood: "williamsburg", address: "55 N 3rd St, Brooklyn, NY", desc: "Trendy Williamsburg studio with exposed brick and a rooftop deck shared with three other tenants. Walking distance to the L train. Good vibes, great neighborhood.", sqft: 1600, price: 680000, minD: 5, maxD: 12, term: "Month-to-Month", img: img(13), pet: true, light: true, park: false, floor: 2, year: 2015 },
    { title: "Chelsea Gallery Space", slug: "chelsea-gallery-space", hood: "chelsea", address: "547 W 27th St, New York, NY", desc: "Former art gallery converted to office use. Pristine white walls, polished concrete, and gallery lighting throughout. Ground floor with street presence.", sqft: 2800, price: 1500000, minD: 10, maxD: 22, term: "12 months", img: img(14), pet: false, light: true, park: false, floor: 1, year: 2000 },
    // Boston listings
    { title: "Fort Point Brick Loft", slug: "fort-point-brick-loft", hood: "fort-point", address: "249 A St, Boston, MA", desc: "Classic Fort Point brick-and-beam loft with artist community vibes. Timber post construction, original maple floors. Walking distance to South Station.", sqft: 2600, price: 780000, minD: 8, maxD: 20, term: "12 months", img: img(0), pet: true, light: true, park: false, floor: 3, year: 1901 },
    { title: "Seaport Modern Suite", slug: "seaport-modern-suite", hood: "seaport", address: "22 Boston Wharf Rd, Boston, MA", desc: "Brand new Class A buildout in the Seaport Innovation District. Floor-to-ceiling glass with harbor views. Turnkey furnished and ready for immediate move-in.", sqft: 3500, price: 1050000, minD: 12, maxD: 28, term: "12-24 months", img: img(1), pet: false, light: true, park: true, floor: 6, year: 2022 },
    { title: "Back Bay Brownstone", slug: "back-bay-brownstone", hood: "back-bay", address: "350 Newbury St, Boston, MA", desc: "Gorgeous brownstone office on Newbury Street. Three floors of flexible space with original fireplaces and bay windows. Nothing else like it in the city.", sqft: 4200, price: 1400000, minD: 15, maxD: 35, term: "24 months", img: img(2), pet: false, light: true, park: false, floor: 1, year: 1880 },
    { title: "Kendall Square Lab", slug: "kendall-square-lab", hood: "kendall-square", address: "1 Broadway, Cambridge, MA", desc: "Wet lab and office hybrid near MIT campus. Perfect for biotech or deep tech teams. Ventilated lab space with standard office areas. Monthly cleaning included.", sqft: 3000, price: 1200000, minD: 10, maxD: 24, term: "12-36 months", img: img(3), pet: false, light: true, park: true, floor: 4, year: 2018 },
    { title: "Back Bay Tech Hub", slug: "back-bay-tech-hub", hood: "back-bay", address: "500 Boylston St, Boston, MA", desc: "Modern tech-focused office in Back Bay. Open floor plan with dedicated server closet and dual redundant fiber lines. Walking distance to Copley Square.", sqft: 5000, price: 1500000, minD: 20, maxD: 50, term: "12-24 months", img: img(4), pet: false, light: true, park: true, floor: 9, year: 2008 },
    { title: "Seaport Flex Space", slug: "seaport-flex-space", hood: "seaport", address: "50 Liberty Dr, Boston, MA", desc: "Flexible month-to-month space in the Seaport. Fully furnished with sit-stand desks and Aeron chairs. Small but mighty - perfect for a seed stage team.", sqft: 1100, price: 440000, minD: 4, maxD: 8, term: "Month-to-Month", img: img(5), pet: true, light: true, park: false, floor: 2, year: 2020 },
    // a few more SF ones
    { title: "SOMA Tech Penthouse", slug: "soma-tech-penthouse", hood: "soma", address: "600 Townsend St, San Francisco, CA", desc: "Penthouse office with a massive private roof deck and 360 degree city views. Recently gut-renovated with all new MEP systems. Two blocks from Caltrain.", sqft: 4800, price: 2200000, minD: 18, maxD: 40, term: "24-36 months", img: img(6), pet: false, light: true, park: true, floor: 8, year: 1998 },
    { title: "Mission Micro Office", slug: "mission-micro-office", hood: "mission", address: "2301 Mission St, San Francisco, CA", desc: "Tiny but efficient micro office for a founding team. One conference room, four desks, and a small kitchenette. Above a great taqueria which is either a pro or a con.", sqft: 650, price: 260000, minD: 2, maxD: 5, term: "Month-to-Month", img: img(7), pet: false, light: true, park: false, floor: 2, year: 1970 },
    // more NYC
    { title: "Soho Penthouse Office", slug: "soho-penthouse", hood: "soho", address: "60 Spring St, New York, NY", desc: "Jaw-dropping penthouse office above Spring Street. Private keyed elevator opens directly into the space. Rooftop terrace with planters and seating for 20.", sqft: 3500, price: 3200000, minD: 12, maxD: 28, term: "24 months", img: img(8), pet: true, light: true, park: false, floor: 6, year: 1900 },
    { title: "Flatiron Startup Den", slug: "flatiron-startup-den", hood: "flatiron", address: "28 W 23rd St, New York, NY", desc: "Cozy startup space on the same floor as two other venture-backed teams. Shared kitchen and event space. Great for networking and cross-pollination of ideas.", sqft: 1400, price: 700000, minD: 5, maxD: 12, term: "6-12 months", img: img(9), pet: false, light: true, park: false, floor: 4, year: 2001 },
    { title: "Midtown Views Suite", slug: "midtown-views-suite", hood: "midtown", address: "1700 Broadway, New York, NY", desc: "Corner suite with floor-to-ceiling views of Times Square and the Hudson. Recently renovated lobby and common areas. Concierge and conference center included.", sqft: 4200, price: 3800000, minD: 15, maxD: 35, term: "12-36 months", img: img(10), pet: false, light: true, park: false, floor: 28, year: 1985 },
    // more Boston
    { title: "Fort Point Artist Loft", slug: "fort-point-artist-loft", hood: "fort-point", address: "300 Summer St, Boston, MA", desc: "Converted artist studio in the heart of Fort Point. Eclectic character with original freight elevator and loading dock. Good bones, needs some TLC.", sqft: 2000, price: 520000, minD: 6, maxD: 15, term: "6-12 months", img: img(11), pet: true, light: true, park: false, floor: 2, year: 1915 },
    { title: "Kendall Innovation Hub", slug: "kendall-innovation-hub", hood: "kendall-square", address: "245 Main St, Cambridge, MA", desc: "Purpose-built innovation space near the Red Line. Open bullpen layout with breakout rooms and a maker space. Shared with a small hardware accelerator.", sqft: 3800, price: 1140000, minD: 12, maxD: 30, term: "12-24 months", img: img(12), pet: false, light: true, park: true, floor: 3, year: 2019 },
  ];

  // insert all listings
  for (const l of listingData) {
    const [inserted] = await db.insert(listings).values({
      title: l.title,
      slug: l.slug,
      neighborhoodId: hoodMap[l.hood],
      address: l.address,
      description: l.desc,
      sqft: l.sqft,
      pricePerMonth: l.price,
      minDesks: l.minD,
      maxDesks: l.maxD,
      leaseTerm: l.term,
      imageUrl: l.img,
      petFriendly: l.pet,
      hasNaturalLight: l.light,
      hasParking: l.park,
      floorLevel: l.floor,
      yearBuilt: l.year,
    }).returning();

    // assign 3-6 random amenities to each listing
    const amenityIds = pickAmenities(3 + Math.floor(Math.random() * 4));
    if (amenityIds.length > 0) {
      await db.insert(listingAmenities).values(
        amenityIds.map(aId => ({ listingId: inserted.id, amenityId: aId }))
      );
    }
  }

  console.log(`seeded ${listingData.length} listings across 3 cities`);
  console.log("done!");
}

seed().catch((err) => {
  console.error("seed failed:", err);
  process.exit(1);
});
