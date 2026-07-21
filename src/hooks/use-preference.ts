"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "canvasui:pref";

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
      const stored = window.localStorage.getItem(storageKey);
      return stored !== null && (valid as readonly string[]).includes(stored)
        ? (stored as T)
        : fallback;
    },
    () => fallback,
  );

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(storageKey, next);
      window.dispatchEvent(new Event(EVENT));
    },
    [storageKey],
  );

  return [value, setValue];
}
