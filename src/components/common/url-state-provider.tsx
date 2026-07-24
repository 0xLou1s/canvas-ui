"use client";

import { NuqsAdapter, enableHistorySync } from "nuqs/adapters/react";
import { useEffect, type ReactNode } from "react";

/**
 * nuqs adapter for URL-persisted demo controls.
 *
 * Uses the plain React adapter rather than the Next.js one: it reads
 * `location.search` directly (empty snapshot on the server), so statically
 * exported pages never bail out into client-side rendering or need Suspense
 * boundaries, and updates stay shallow `history.replaceState` calls.
 * `enableHistorySync` keeps nuqs in sync with the playground's own
 * `history.replaceState` navigation when switching components.
 */

/** History entries committed by the Next.js app router carry this flag. */
function isNextRouterState(state: unknown): boolean {
  return (
    typeof state === "object" &&
    state !== null &&
    "__NA" in (state as Record<string, unknown>)
  );
}

/**
 * The app router commits its history entries inside a `useInsertionEffect`,
 * where nuqs's synchronous history-sync would schedule React updates
 * ("useInsertionEffect must not schedule updates"). Wrap the nuqs-patched
 * history methods so router-internal commits pass nuqs's skip marker, then
 * re-sync in a microtask — after the commit — so any mounted query state
 * still picks up the URL change.
 */
let historySyncDeferred = false;

function deferHistorySyncForNextRouter() {
  if (historySyncDeferred) return;
  historySyncDeferred = true;
  const { pushState, replaceState } = window.history;
  let resyncQueued = false;

  const queueResync = () => {
    if (resyncQueued) return;
    resyncQueued = true;
    queueMicrotask(() => {
      resyncQueued = false;
      // Same-URL replace through the nuqs-patched method; its only effect
      // is emitting the deferred sync when the search string changed.
      replaceState.call(window.history, window.history.state, "", location.href);
    });
  };

  const wrap = (method: typeof pushState): typeof pushState =>
    function (this: History, state, unused, url) {
      if (url != null && isNextRouterState(state)) {
        method.call(this, state, "__nuqs__", url);
        queueResync();
      } else {
        method.call(this, state, unused, url);
      }
    };

  window.history.pushState = wrap(pushState);
  window.history.replaceState = wrap(replaceState);
}

export function UrlStateProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    enableHistorySync();
    deferHistorySyncForNextRouter();
  }, []);

  return <NuqsAdapter>{children}</NuqsAdapter>;
}
