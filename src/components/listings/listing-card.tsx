import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface ListingCardProps {
  slug: string;
  title: string;
  neighborhood: string;
  city: string;
  sqft: number;
  pricePerMonth: number;
  minDesks: number;
  maxDesks: number;
  leaseTerm: string;
  imageUrl: string | null;
  petFriendly: boolean | null;
}

export function ListingCard({ slug, title, neighborhood, city, sqft, pricePerMonth, minDesks, maxDesks, leaseTerm, imageUrl, petFriendly }: ListingCardProps) {
  return (
    <Link href={`/listings/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
        {/* image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
              {city}
            </span>
          </div>
          {petFriendly && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                🐕 Pet Friendly
              </span>
            </div>
          )}
        </div>

        {/* info */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {neighborhood}
          </div>
          <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(pricePerMonth)}
              </span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>{sqft.toLocaleString()} sqft</div>
              <div>{minDesks}-{maxDesks} desks</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
