"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "canvasui:pref";

// Touching localStorage can throw (cookies blocked entirely, some embedded
// webviews); treat that the same as nothing stored so pages still render.
function readStored(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function usePreference<T extends string>(
  key: string,
  fallback: T,
  valid: readonly T[],
): [T, (value: T) => void] {
  const storageKey = `canvasui:${key}`;

  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = readStored(storageKey);
      return stored !== null && (valid as readonly string[]).includes(stored)
        ? (stored as T)
        : fallback;
    },
    () => fallback,
  );

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Persisting failed; still notify so the in-tab UI updates.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [storageKey],
  );

  return [value, setValue];
}
