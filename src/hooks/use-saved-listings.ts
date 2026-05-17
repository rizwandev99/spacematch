"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "spacematch_saved";

export function useSavedListings() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    // load from localstorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      // ignore parse errors
      console.log("failed to load saved listings", e);
    }
  }, []);

  const toggleSave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: number) => savedIds.includes(id),
    [savedIds]
  );

  return { savedIds, toggleSave, isSaved };
}
