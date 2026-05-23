"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2 } from "lucide-react";

const LOADING_STATUSES = [
  "Analyzing requirements...",
  "Scanning available listings...",
  "Matching preferences...",
  "Aligning results for view...",
  "Formatting final response..."
];

export function DynamicLoader() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    // Cycle through statuses every 1.5 seconds, but stop at the last one
    const interval = setInterval(() => {
      setStatusIndex((current) => 
        current < LOADING_STATUSES.length - 1 ? current + 1 : current
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <Bot className="h-4 w-4 text-blue-600" />
      </div>
      <div className="rounded-lg bg-gray-100 px-4 py-3 min-w-[240px]">
        <div className="flex items-center gap-3 text-sm text-gray-600 italic">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span 
            key={statusIndex} 
            className="animate-pulse transition-opacity duration-300"
          >
            {LOADING_STATUSES[statusIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
