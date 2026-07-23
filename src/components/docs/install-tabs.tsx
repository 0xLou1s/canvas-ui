"use client";

import { CopyButton } from "@/components/docs/copy-button";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

const MANAGERS = [
  { id: "npm", label: "npm", run: "npx" },
  { id: "pnpm", label: "pnpm", run: "pnpm dlx" },
  { id: "yarn", label: "yarn", run: "yarn dlx" },
  { id: "bun", label: "bun", run: "bunx --bun" },
] as const;

const FRAMEWORKS = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "vanilla", label: "Vanilla" },
] as const;

export const MANAGER_IDS = MANAGERS.map((manager) => manager.id);
export const FRAMEWORK_IDS = FRAMEWORKS.map((framework) => framework.id);

export function buildInstallCommand(
  managerId: string,
  item: string,
  frameworkId: string,
) {
  const manager = MANAGERS.find((m) => m.id === managerId) ?? MANAGERS[0];
  return `${manager.run} shadcn@latest add @canvas-ui/${item}-${frameworkId}`;
}

export function InstallTabs({ item }: { item: string }) {
  const [managerId, setManagerId] = usePreference("pm", "npm", MANAGER_IDS);
  const [frameworkId, setFrameworkId] = usePreference(
    "framework",
    "react",
    FRAMEWORK_IDS,
  );

  const manager = MANAGERS.find((m) => m.id === managerId) ?? MANAGERS[0];
  const fullCommand = buildInstallCommand(manager.id, item, frameworkId);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-2">
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
        <div
          role="tablist"
          aria-label="Framework"
          className="flex items-center"
        >
          {FRAMEWORKS.map((entry) => (
            <button
              key={entry.id}
              role="tab"
              type="button"
              aria-selected={entry.id === frameworkId}
              onClick={() => setFrameworkId(entry.id)}
              className={cn(
                "relative px-3 py-2 text-[13px] transition-colors duration-150",
                entry.id === frameworkId
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px bg-foreground transition-opacity duration-150",
                  entry.id === frameworkId ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 py-1.5 pr-1.5 pl-4">
        <code className="overflow-x-auto text-[13px] whitespace-nowrap text-foreground/90">
          {fullCommand}
        </code>
        <CopyButton text={fullCommand} />
      </div>
    </div>
  );
}
