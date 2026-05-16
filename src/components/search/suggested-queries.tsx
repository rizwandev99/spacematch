"use client";

const suggestions = [
  "10 person team in SF, dog friendly, under $8k/mo",
  "20-30 desks in NYC Soho or Tribeca with natural light",
  "Small 5 person office in Boston near transit",
  "Startup office in San Francisco with parking and rooftop",
  "Affordable office in Brooklyn for a seed stage team",
];

interface SuggestedQueriesProps {
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
