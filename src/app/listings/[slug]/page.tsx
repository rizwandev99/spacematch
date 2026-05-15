"use client";

import { trpc } from "@/trpc/provider";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Calendar, ParkingCircle, Dog, Sun, Building } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: listing, isLoading } = trpc.listings.getBySlug.useQuery(slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="aspect-[16/9] bg-gray-200 rounded-xl" />
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link href="/listings" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to listings
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/listings" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      {/* hero image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {listing.neighborhood}, {listing.city}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{listing.title}</h1>
          
          {listing.address && (
            <p className="mt-1 text-sm text-gray-500">{listing.address}</p>
          )}

          <p className="mt-6 text-gray-700 leading-relaxed">{listing.description}</p>

          {/* amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((a: any) => (
                  <span
                    key={a.name}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
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
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(listing.pricePerMonth)}
              <span className="text-base font-normal text-gray-500">/mo</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4" />
                {listing.sqft.toLocaleString()} sqft
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                {listing.minDesks}-{listing.maxDesks} desks
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                {listing.leaseTerm}
              </div>
              {listing.petFriendly && (
                <div className="flex items-center gap-2 text-green-600">
                  <Dog className="h-4 w-4" />
                  Pet friendly
                </div>
              )}
              {listing.hasParking && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ParkingCircle className="h-4 w-4" />
                  Parking available
                </div>
              )}
              {listing.hasNaturalLight && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Sun className="h-4 w-4" />
                  Natural light
                </div>
              )}
              {listing.transitScore && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Transit score: {listing.transitScore}/100
                </div>
              )}
            </div>

            {listing.yearBuilt && (
              <p className="mt-3 text-xs text-gray-400">Built in {listing.yearBuilt}</p>
            )}

            <button className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              Request Tour
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
