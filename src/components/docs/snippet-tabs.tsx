"use client";

import type { ReactNode } from "react";

import { CopyButton } from "@/components/docs/copy-button";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

export interface SnippetTab {
  /** Short identifier, e.g. "claude". */
  id: string;
  /** Tab label, e.g. "Claude Code". */
  label: string;
  /** Optional file name shown above the code. */
  fileName?: string;
  /** Raw source, used for the copy button. */
  source: string;
  /** Pre-highlighted HTML. Omit for a single-line command row. */
  html?: string;
}

export function SnippetTabs({
  storageKey,
  tabs,
  footers,
}: {
  /** localStorage key suffix the selection is persisted under. */
  storageKey: string;
  /** One snippet per tab, in display order. */
  tabs: readonly SnippetTab[];
  /** Optional content rendered below the snippet per tab id. */
  footers?: Record<string, ReactNode>;
}) {
  const [activeId, setActiveId] = usePreference(
    storageKey,
    tabs[0]?.id ?? "",
    tabs.map((tab) => tab.id),
  );
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <div>
      <div className="not-typeset overflow-hidden rounded-xl border border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 pr-1.5 pl-2">
          <div role="tablist" aria-label="Client" className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={tab.id === active.id}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "relative shrink-0 px-3 py-2 text-[13px] transition-colors duration-150",
                  tab.id === active.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px bg-foreground transition-opacity duration-150",
                    tab.id === active.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            ))}
          </div>
          {active.html ? <CopyButton text={active.source} /> : null}
        </div>
        {active.html ? (
          <>
            {active.fileName ? (
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
                <span className="text-[12px] text-muted-foreground">
                  {active.fileName}
                </span>
              </div>
            ) : null}
            <div
              className="docs-code max-h-[480px] overflow-auto text-[13px] leading-6"
              dangerouslySetInnerHTML={{ __html: active.html }}
            />
          </>
        ) : (
          <div className="flex items-center justify-between gap-3 py-1.5 pr-1.5 pl-4">
            <code className="overflow-x-auto text-[13px] whitespace-nowrap text-foreground/90">
              {active.source}
            </code>
            <CopyButton text={active.source} />
          </div>
        )}
      </div>
      {footers?.[active.id] ? <div>{footers[active.id]}</div> : null}
    </div>
  );
}
