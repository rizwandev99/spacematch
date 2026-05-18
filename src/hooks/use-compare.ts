"use client";

import { useState, useCallback } from "react";

const MAX_COMPARE = 3;

export function useCompare() {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const toggleCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        // tried using useCallback here but it didn't help
        // just silently ignore if we're at max
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const isComparing = useCallback(
    (id: number) => compareIds.includes(id),
    [compareIds]
  );

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return { compareIds, toggleCompare, isComparing, clearCompare, canAdd: compareIds.length < MAX_COMPARE };
}
