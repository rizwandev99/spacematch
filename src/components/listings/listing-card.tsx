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

export function ListingCard({
  slug,
  title,
  neighborhood,
  city,
  sqft,
  pricePerMonth,
  minDesks,
  maxDesks,
  leaseTerm,
  imageUrl,
  petFriendly,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(124,110,245,0.3)";
          el.style.boxShadow = "0 4px 24px rgba(124,110,245,0.1)";
          el.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(255,255,255,0.08)";
          el.style.boxShadow = "none";
          el.style.transform = "none";
        }}
      >
        {/* image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            width: "100%",
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: "cover", transition: "transform 0.3s" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontSize: 12,
                color: "#4a4a58",
              }}
            >
              No image
            </div>
          )}

          {/* city badge */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 100,
                background: "rgba(13,13,15,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                fontSize: 11,
                color: "#9191a0",
                fontWeight: 500,
              }}
            >
              {city}
            </span>
          </div>

          {petFriendly && (
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 100,
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  fontSize: 11,
                  color: "#4ade80",
                }}
              >
                🐕 Pet OK
              </span>
            </div>
          )}
        </div>

        {/* info */}
        <div style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#6b6b7a",
              marginBottom: 4,
            }}
          >
            <MapPin style={{ width: 11, height: 11 }} />
            {neighborhood}
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#e8e8ea",
              margin: 0,
              letterSpacing: "-0.2px",
            }}
          >
            {title}
          </h3>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#e8e8ea" }}>
                {formatPrice(pricePerMonth)}
              </span>
              <span style={{ fontSize: 11, color: "#6b6b7a" }}>/mo</span>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "#6b6b7a" }}>
              <div>{sqft.toLocaleString()} sqft</div>
              <div>
                {minDesks}–{maxDesks} desks
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
