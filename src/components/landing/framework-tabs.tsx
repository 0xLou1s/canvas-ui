"use client";

import { useState } from "react";

import { ChoiceSelect } from "@/components/docs/choice-select";
import { CopyButton } from "@/components/docs/copy-button";

export interface FrameworkVariant {
  id: string;
  label: string;
  fileName: string;
  source: string;
  /** Pre-highlighted HTML produced on the server. */
  html: string;
}

export function FrameworkTabs({ variants }: { variants: FrameworkVariant[] }) {
  const [activeId, setActiveId] = useState(variants[0]?.id);
  const active = variants.find((v) => v.id === activeId) ?? variants[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-2">
        <ChoiceSelect
          label="Framework"
          options={variants}
          value={active.id}
          onValueChange={setActiveId}
        />
        <div className="flex items-center gap-2 pr-1.5">
          <span className="hidden text-[12px] text-muted-foreground sm:block">
            {active.fileName}
          </span>
          <CopyButton text={active.source} />
        </div>
      </div>
      <div
        key={active.id}
        className="docs-code framework-snippet-enter min-h-56 overflow-x-auto text-[13px] leading-6"
        dangerouslySetInnerHTML={{ __html: active.html }}
      />
    </div>
  );
}
