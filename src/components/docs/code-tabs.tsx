"use client";

import { CopyButton } from "@/components/docs/copy-button";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

export interface CodeVariant {
  /** Short identifier, e.g. "react". */
  id: string;
  /** Tab label, e.g. "React". */
  label: string;
  /** File name shown above the code. */
  fileName: string;
  /** Raw source, used for the copy button. */
  source: string;
  /** Pre-highlighted HTML produced on the server. */
  html: string;
}

export function CodeTabs({ variants }: { variants: CodeVariant[] }) {
  const [activeId, setActiveId] = usePreference(
    "framework",
    variants[0]?.id ?? "react",
    variants.map((variant) => variant.id),
  );
  const active = variants.find((v) => v.id === activeId) ?? variants[0];

  if (!active) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 pr-1.5 pl-2">
        <div
          role="tablist"
          aria-label="Framework"
          className="flex items-center"
        >
          {variants.map((variant) => (
            <button
              key={variant.id}
              role="tab"
              type="button"
              aria-selected={variant.id === active.id}
              onClick={() => setActiveId(variant.id)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors duration-150",
                variant.id === active.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {variant.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px bg-foreground transition-opacity duration-150",
                  variant.id === active.id ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
        <CopyButton text={active.source} />
      </div>
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <span className="text-[12px] text-muted-foreground">
          {active.fileName}
        </span>
      </div>
      <div
        className="docs-code max-h-[480px] overflow-y-auto text-[13px] leading-6"
        dangerouslySetInnerHTML={{ __html: active.html }}
      />
    </div>
  );
}
