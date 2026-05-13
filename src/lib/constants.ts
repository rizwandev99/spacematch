export const CITIES = [
  { name: "San Francisco", slug: "san-francisco", state: "CA" },
  { name: "New York", slug: "new-york", state: "NY" },
  { name: "Boston", slug: "boston", state: "MA" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Size: Largest", value: "size-desc" },
] as const;
