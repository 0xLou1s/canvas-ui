"use client";

import { play } from "cuelume";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ChoiceOption<T extends string = string> {
  id: T;
  label: string;
}

/**
 * The control the docs chrome uses to switch framework, package manager, or
 * client. By default it's the Base UI select at every viewport size — with six
 * supported frameworks a row of tabs no longer fits. Short, fixed lists (the
 * four package managers) can opt into `variant="tabs"`: the flush tablist on
 * `sm` and up, collapsing to the select below where tabs would overflow. Call
 * sites supply data only.
 */
export function ChoiceSelect<T extends string>({
  label,
  options,
  value,
  onValueChange,
  align,
  className,
  variant = "select",
}: {
  /** Accessible name for the control, e.g. "Framework". */
  label: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Which trigger edge the popup hangs from. `"end"` for a right-flush row. */
  align?: "start" | "end";
  className?: string;
  /** `"tabs"` shows a tablist on `sm`+ (for short lists); select otherwise. */
  variant?: "select" | "tabs";
}) {
  const select = (next: T) => {
    onValueChange(next);
    play("bloom");
  };

  return (
    <>
      {variant === "tabs" ? (
        <div
          role="tablist"
          aria-label={label}
          className={cn("hidden items-center sm:flex", className)}
        >
          {options.map((option) => {
            const selected = option.id === value;
            return (
              <button
                key={option.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => select(option.id)}
                className={cn(
                  "relative shrink-0 px-3 py-2.5 text-[13px] transition-colors duration-150",
                  selected
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px bg-foreground transition-opacity duration-150",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <Select<T>
        value={value}
        onValueChange={(next) => {
          if (next === null) return;
          select(next);
        }}
      >
        <SelectTrigger
          aria-label={label}
          className={cn(
            "my-1.5 min-w-0",
            variant === "tabs" && "sm:hidden",
            className,
          )}
        >
          <SelectValue className="truncate">
            {(current: T | null) =>
              options.find((option) => option.id === current)?.label ?? label
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent align={align}>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
