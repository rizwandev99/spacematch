"use client";

import { useSavedListings } from "@/hooks/use-saved-listings";
import { trpc } from "@/trpc/provider";
import { ListingCard } from "@/components/listings/listing-card";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { savedIds } = useSavedListings();
  const { data: allListings } = trpc.listings.getAll.useQuery({});

  // filter listings to only saved ones
  // TODO: add pagination when we have more listings
  const savedListings = allListings?.filter((l) => savedIds.includes(l.id)) || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Listings</h1>
        <p className="mt-1 text-gray-500">Your bookmarked offices</p>
      </div>

      {savedListings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
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
          <Bookmark className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-700">No saved listings yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Browse offices and click the bookmark icon to save them here.
          </p>
          <Link
            href="/listings"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse Listings
          </Link>
        </div>
      )}
    </main>
  );
}
