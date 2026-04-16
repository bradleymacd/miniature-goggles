"use client";

import { useEffect } from "react";
import { STORAGE_KEY } from "@/store/seed";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export function StoreHydrator() {
  const actions = usePrototypeStore((s) => s.actions);

  useEffect(() => {
    // If we have nothing persisted yet, seed once.
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) actions.seed();
    } catch {
      actions.seed();
    }

    // Track hydration to prevent subtle mismatches in later steps.
    const unsub = usePrototypeStore.persist.onFinishHydration(() => {
      actions.setHasHydrated(true);
    });

    // Ensure hydration happens (noop if already).
    usePrototypeStore.persist.rehydrate();
    return () => unsub();
  }, [actions]);

  return null;
}

