"use client";

import { useState } from "react";
import { trpc } from "@/trpc/provider";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Calendar, ParkingCircle, Dog, Sun, Building } from "lucide-react";
import { TourRequestForm } from "@/components/listings/tour-request-form";

export default function ListingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showTourForm, setShowTourForm] = useState(false);

  const { data: listing, isLoading } = trpc.listings.getBySlug.useQuery(slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-slate-800 rounded" />
          <div className="aspect-[16/9] bg-slate-800 rounded-xl" />
          <div className="h-8 w-64 bg-slate-800 rounded" />
          <div className="h-4 w-full bg-slate-800 rounded" />
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link href="/listings" className="mt-4 inline-block text-[#7c6ef5] hover:underline">
          ← Back to listings
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/listings" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      {/* hero image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[rgba(255,255,255,0.05)]">
        {listing.imageUrl && (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* main content */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4" />
            {listing.neighborhood}, {listing.city}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-200">{listing.title}</h1>
          
          {listing.address && (
            <p className="mt-1 text-sm text-slate-400">{listing.address}</p>
          )}

          <p className="mt-6 text-slate-300 leading-relaxed">{listing.description}</p>

          {/* amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-200">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((a: any) => (
                  <span
                    key={a.name}
                    className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1.5 text-sm text-slate-300"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-800/60 bg-[#0f1115] p-6">
            <div className="text-3xl font-bold text-slate-200">
              {formatPrice(listing.pricePerMonth)}
              <span className="text-base font-normal text-slate-400">/mo</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Building className="h-4 w-4" />
                {listing.sqft.toLocaleString()} sqft
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="h-4 w-4" />
                {listing.minDesks}-{listing.maxDesks} desks
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                {listing.leaseTerm}
              </div>
              {listing.petFriendly && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Dog className="h-4 w-4" />
                  Pet friendly
                </div>
              )}
              {listing.hasParking && (
                <div className="flex items-center gap-2 text-slate-400">
                  <ParkingCircle className="h-4 w-4" />
                  Parking available
                </div>
              )}
              {listing.hasNaturalLight && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Sun className="h-4 w-4" />
                  Natural light
                </div>
              )}
              {listing.transitScore && (
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  Transit score: {listing.transitScore}/100
                </div>
              )}
            </div>

            {listing.yearBuilt && (
              <p className="mt-3 text-xs text-slate-500">Built in {listing.yearBuilt}</p>
            )}

            <button
              onClick={() => setShowTourForm(true)}
              className="mt-6 w-full rounded-lg bg-[#7c6ef5] py-2.5 text-sm font-medium text-white hover:bg-[#6b5ee0] transition-colors"
            >
              Request Tour
            </button>
          </div>
        </div>
      </div>

      {/* tour request modal */}
      {showTourForm && (
        <TourRequestForm
          listingId={listing.id}
          listingTitle={listing.title}
          onClose={() => setShowTourForm(false)}
        />
      )}
    </main>
  );
}
