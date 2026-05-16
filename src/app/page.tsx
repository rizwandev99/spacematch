"use client";

import Link from "next/link";
import { useChat } from "ai/react";
import { ChatInput } from "@/components/search/chat-input";
import { ChatMessages } from "@/components/search/chat-messages";
import { SuggestedQueries } from "@/components/search/suggested-queries";
import { Search } from "lucide-react";

export default function Home() {
  const { messages, append, isLoading } = useChat({
    api: "/api/chat",
  });

  const handleSend = (text: string) => {
    append({ role: "user", content: text });
  };

  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-medium text-blue-700">
              AI-Powered Search
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Find your team&apos;s next{" "}
              <span className="text-blue-600">office space</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 md:text-xl">
              Describe what you need in plain English. Our AI searches across
              hundreds of listings in SF, NYC, and Boston to find your perfect match.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/listings"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Browse All Listings
              </Link>
              <a
                href="#search"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                Try AI Search ↓
              </a>
            </div>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
      </section>

      {/* stats row */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-around gap-6 px-4 py-10 md:flex-row md:gap-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="mt-1 text-sm text-gray-500">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">40+</div>
            <div className="mt-1 text-sm text-gray-500">Verified Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">AI</div>
            <div className="mt-1 text-sm text-gray-500">Powered Search</div>
          </div>
        </div>
      </section>

      {/* AI search section */}
      <section id="search" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Office Search</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Describe what your team needs and our AI will find matching offices. Try one of these:
          </p>

          {messages.length === 0 && (
            <div className="mb-6">
              <SuggestedQueries onSelect={handleSend} />
            </div>
          )}

          {/* chat messages */}
          <div className="mb-4 max-h-[500px] overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>

          {/* chat input */}
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </section>

      {/* how it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Describe your needs", desc: "Tell our AI what your team needs — size, budget, location, vibe. Use natural language." },
              { step: "2", title: "Get matched", desc: "Our AI searches the full market and ranks listings based on your specific requirements." },
              { step: "3", title: "Book a tour", desc: "Save your favorites, compare side-by-side, and request tours directly through the app." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
