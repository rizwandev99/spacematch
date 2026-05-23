"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const LOADING_STATUSES = [
  "Analyzing requirements...",
  "Scanning available listings...",
  "Matching preferences...",
  "Ranking results...",
  "Formatting response...",
];

export function DynamicLoader() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((current) =>
        current < LOADING_STATUSES.length - 1 ? current + 1 : current
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(124,110,245,0.15)",
          border: "1px solid rgba(124,110,245,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Bot style={{ width: 14, height: 14, color: "#7c6ef5" }} />
      </div>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "12px 12px 12px 4px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.07)",
          minWidth: 200,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "#6b6b7a",
          }}
        >
          {/* three dot loader */}
          <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#7c6ef5",
                  display: "inline-block",
                  animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }}
              />
            ))}
          </span>
          <span key={statusIndex} style={{ transition: "opacity 0.3s" }}>
            {LOADING_STATUSES[statusIndex]}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scaleY(1); opacity: 0.5; }
          40% { transform: scaleY(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
