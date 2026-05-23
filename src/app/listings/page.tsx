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
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      {/* header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#e8e8ea",
            letterSpacing: "-0.5px",
            margin: 0,
          }}
        >
          Browse Offices
        </h1>
        <p style={{ marginTop: 4, fontSize: 13, color: "#6b6b7a" }}>
          Find your team&apos;s next workspace
        </p>
      </div>

      {/* filters */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {[{ slug: undefined, name: "All" }, ...CITIES].map((c) => {
            const active = cityFilter === c.slug;
            return (
              <button
                key={String(c.slug)}
                onClick={() => setCityFilter(c.slug)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 100,
                  border: active
                    ? "1px solid rgba(124,110,245,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(124,110,245,0.15)" : "rgba(255,255,255,0.04)",
                  color: active ? "#a89cf5" : "#6b6b7a",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: "5px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#9191a0",
            fontSize: 12,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#1a1a1f" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* grid */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.03)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <div style={{ aspectRatio: "4/3", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    height: 10,
                    width: 80,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    width: 160,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
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
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "#6b6b7a", fontSize: 14 }}>No listings found</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
