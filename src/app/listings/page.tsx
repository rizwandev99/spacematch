"use client";

import { trpc } from "@/trpc/provider";
import { ListingCard } from "@/components/listings/listing-card";
import { useState } from "react";
import { CITIES, SORT_OPTIONS } from "@/lib/constants";

export default function ListingsPage() {
  const [cityFilter, setCityFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: listings, isLoading } = trpc.listings.getAll.useQuery({
    city: cityFilter,
    sort: sortBy,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Offices</h1>
        <p className="mt-1 text-gray-500">Find your team&apos;s next workspace</p>
      </div>

      {/* filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setCityFilter(undefined)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !cityFilter
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {CITIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCityFilter(c.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cityFilter === c.slug
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              slug={listing.slug}
              title={listing.title}
              neighborhood={listing.neighborhood}
              city={listing.city}
              sqft={listing.sqft}
              pricePerMonth={listing.pricePerMonth}
              minDesks={listing.minDesks}
              maxDesks={listing.maxDesks}
              leaseTerm={listing.leaseTerm}
              imageUrl={listing.imageUrl}
              petFriendly={listing.petFriendly}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500">No listings found</p>
        </div>
      )}
    </main>
  );
}
