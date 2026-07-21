import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface LinkCard {
  /** Destination route. */
  href: string;
  /** Card title. */
  title: string;
  /** Short muted description shown under the title. */
  description: string;
}

export function LinkCards({ items }: { items: LinkCard[] }) {
  return (
    <div className="not-typeset grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-xl border border-border/60 p-4 transition-colors duration-150 hover:bg-muted/40"
        >
          <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
            {item.title}
            <ChevronRight
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </span>
          <span className="mt-1 block truncate text-[13px] text-muted-foreground">
            {item.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
