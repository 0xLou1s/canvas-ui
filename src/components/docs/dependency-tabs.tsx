"use client";

import { CopyButton } from "@/components/docs/copy-button";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

const MANAGERS = [
  { id: "npm", label: "npm", install: "npm install", dev: "npm install -D" },
  { id: "pnpm", label: "pnpm", install: "pnpm add", dev: "pnpm add -D" },
  { id: "yarn", label: "yarn", install: "yarn add", dev: "yarn add -D" },
  { id: "bun", label: "bun", install: "bun add", dev: "bun add -d" },
] as const;

const MANAGER_IDS = MANAGERS.map((manager) => manager.id);

export function DependencyTabs({
  dependencies,
  devDependencies,
}: {
  dependencies: string[];
  devDependencies: string[];
}) {
  const [managerId, setManagerId] = usePreference("pm", "npm", MANAGER_IDS);
  const manager = MANAGERS.find((m) => m.id === managerId) ?? MANAGERS[0];

  const commands: string[] = [];
  if (dependencies.length > 0) {
    commands.push(`${manager.install} ${dependencies.join(" ")}`);
  }
  if (devDependencies.length > 0) {
    commands.push(`${manager.dev} ${devDependencies.join(" ")}`);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="flex items-center border-b border-border/60 bg-muted/40 px-2">
        <div
          role="tablist"
          aria-label="Package manager"
          className="flex items-center"
        >
          {MANAGERS.map((entry) => (
            <button
              key={entry.id}
              role="tab"
              type="button"
              aria-selected={entry.id === manager.id}
              onClick={() => setManagerId(entry.id)}
              className={cn(
                "relative px-3 py-2 text-[13px] transition-colors duration-150",
                entry.id === manager.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px bg-foreground transition-opacity duration-150",
                  entry.id === manager.id ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 py-1.5 pr-1.5 pl-4">
        <code className="overflow-x-auto text-[13px] whitespace-pre text-foreground/90">
          {commands.join("\n")}
        </code>
        <CopyButton text={commands.join("\n")} />
      </div>
    </div>
  );
}
