"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { MapPin, ArrowRight } from "lucide-react";

// FIXME: this type should probably come from the trpc router
interface SearchResult {
  id: number;
  title: string;
  slug: string;
  neighborhood: string;
  city: string;
  sqft: number;
  pricePerMonth: number; // in dollars from AI
  minDesks: number;
  maxDesks: number;
  petFriendly: boolean | null;
}

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-3 text-sm font-medium text-gray-500">
        Found {results.length} matching offices
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.slug}`}
            className="group flex gap-3 rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {listing.neighborhood}, {listing.city}
              </div>
              <h4 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                {listing.title}
              </h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="font-medium text-gray-900">
                  ${listing.pricePerMonth.toLocaleString()}/mo
                </span>
                <span>{listing.sqft.toLocaleString()} sqft</span>
                <span>{listing.minDesks}-{listing.maxDesks} desks</span>
              </div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
