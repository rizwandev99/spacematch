"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          space<span className="text-blue-600">match</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/listings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Browse
          </Link>
          <Link href="/saved" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Saved
          </Link>
          <Link href="/compare" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Compare
          </Link>
        </nav>

        {/* mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/listings" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
              Browse
            </Link>
            <Link href="/saved" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
              Saved
            </Link>
            <Link href="/compare" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
              Compare
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
