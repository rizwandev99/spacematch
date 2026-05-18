"use client";

import { trpc } from "@/trpc/provider";
import { formatPrice } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { Suspense } from "react";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").map(Number).filter(Boolean) || [];

  const { data: allListings } = trpc.listings.getAll.useQuery({});

  const compareListings = allListings?.filter((l) => ids.includes(l.id)) || [];

  if (ids.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-medium text-gray-700">No listings to compare</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select listings from the browse page to compare them side by side.
        </p>
        <Link
          href="/listings"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 pr-4 text-left text-sm font-medium text-gray-500 w-40">
              Feature
            </th>
            {compareListings.map((l) => (
              <th key={l.id} className="px-4 py-4 text-left">
                <Link href={`/listings/${l.slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
                  {l.title}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          <CompareRow label="Location" values={compareListings.map((l) => `${l.neighborhood}, ${l.city}`)} />
          <CompareRow label="Price" values={compareListings.map((l) => `${formatPrice(l.pricePerMonth)}/mo`)} />
          <CompareRow label="Size" values={compareListings.map((l) => `${l.sqft.toLocaleString()} sqft`)} />
          <CompareRow label="Team Size" values={compareListings.map((l) => `${l.minDesks}-${l.maxDesks} desks`)} />
          <CompareRow label="Lease Term" values={compareListings.map((l) => l.leaseTerm)} />
          <CompareRow
            label="Pet Friendly"
            values={compareListings.map((l) =>
              l.petFriendly ? "✓ Yes" : "✗ No"
            )}
          />
          <CompareRow
            label="Parking"
            values={compareListings.map((l) =>
              l.hasParking ? "✓ Yes" : "✗ No"
            )}
          />
          <CompareRow
            label="Natural Light"
            values={compareListings.map((l) =>
              l.hasNaturalLight ? "✓ Yes" : "✗ No"
            )}
          />
        </tbody>
      </table>
    </div>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4 font-medium text-gray-500">{label}</td>
      {values.map((val, i) => (
        <td key={i} className="px-4 py-3 text-gray-900">
          {val}
        </td>
      ))}
    </tr>
  );
}

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/listings" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Listings</h1>
        <p className="mt-1 text-gray-500">Side-by-side comparison of your selected offices</p>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading comparison...</div>}>
        <CompareContent />
      </Suspense>
    </main>
  );
}
