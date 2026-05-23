"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/listings", label: "Browse" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header
      style={{
        position: isHome ? "absolute" : "sticky",
        width: "100%",
        top: 0,
        zIndex: 50,
        background: isHome ? "transparent" : "rgba(13, 13, 15, 0.85)",
        borderBottom: isHome ? "none" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: isHome ? "none" : "blur(16px)",
        WebkitBackdropFilter: isHome ? "none" : "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#e8e8ea",
            }}
          >
            space
            <span style={{ color: "#7c6ef5" }}>match</span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  padding: "6px 14px",
                  borderRadius: 8,
                  color: active ? "#e8e8ea" : "#ffffff",
                  background: active ? "rgba(255,255,255,0.07)" : "transparent",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#b0b0c0";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9191a0",
            padding: 6,
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "12px 20px",
          }}
          className="md:hidden"
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 14,
                  padding: "10px 12px",
                  borderRadius: 8,
                  color: "#9191a0",
                  textDecoration: "none",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
