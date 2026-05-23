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
      <h3 className="mb-3 text-sm font-medium text-slate-400">
        Found {results.length} matching offices
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.slug}`}
            className="group flex gap-3 rounded-lg border border-slate-800/60 p-3 transition-shadow hover:shadow-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3" />
                {listing.neighborhood}, {listing.city}
              </div>
              <h4 className="mt-1 text-sm font-semibold text-slate-200 group-hover:text-[#7c6ef5]">
                {listing.title}
              </h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="font-medium text-slate-200">
                  ${listing.pricePerMonth.toLocaleString()}/mo
                </span>
                <span>{listing.sqft.toLocaleString()} sqft</span>
                <span>{listing.minDesks}-{listing.maxDesks} desks</span>
              </div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#7c6ef5]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
