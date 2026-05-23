"use client";

const suggestions = [
  "10 person team in SF, dog friendly, under $8k/mo",
  "20-30 desks in NYC Soho or Tribeca with natural light",
  "Small 5 person office in Boston near transit",
  "Startup office in San Francisco with parking and rooftop",
];

interface SuggestedQueriesProps {
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            color: "#e8e8ea",
            fontSize: 12,
            cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s, background 0.15s",
            fontFamily: "inherit",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = "rgba(124,110,245,0.4)";
            b.style.color = "#a89cf5";
            b.style.background = "rgba(124,110,245,0.08)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = "rgba(255,255,255,0.15)";
            b.style.color = "#e8e8ea";
            b.style.background = "rgba(255,255,255,0.08)";
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
