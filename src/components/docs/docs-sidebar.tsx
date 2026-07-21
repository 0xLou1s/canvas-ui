"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shapes } from "lucide-react";
import { useLayoutEffect, useState } from "react";

import { SiteLogo } from "@/components/common/site-logo";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Getting Started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/mcp", label: "MCP" },
    ],
  },
  {
    title: "Components",
    items: [
      { href: "/components", label: "Browse All" },
      { href: "/docs/components/asciify", label: "Asciify" },
      { href: "/docs/components/bend", label: "Bend" },
      { href: "/docs/components/blaze", label: "Blaze" },
      { href: "/docs/components/bubble", label: "Bubble" },
      { href: "/docs/components/cloth", label: "Cloth" },
      { href: "/docs/components/clouds", label: "Clouds" },
      { href: "/docs/components/dithered-object", label: "Dithered Object" },
      { href: "/docs/components/droplets", label: "Droplets" },
      { href: "/docs/components/glass", label: "Glass" },
      { href: "/docs/components/glass-object", label: "Glass Object" },
      { href: "/docs/components/grid", label: "Grid" },
      { href: "/docs/components/laser", label: "Laser" },
      { href: "/docs/components/liquid", label: "Liquid" },
      { href: "/docs/components/magnify", label: "Magnify" },
      { href: "/docs/components/particle-object", label: "Particle Object" },
      { href: "/docs/components/particle-reveal", label: "Particle Reveal" },
      { href: "/docs/components/particle-scroll", label: "Particle Scroll" },
      { href: "/docs/components/peel", label: "Peel" },
      { href: "/docs/components/retro-dither", label: "Retro Dither" },
      { href: "/docs/components/shatter", label: "Shatter" },
      { href: "/docs/components/vhs", label: "VHS" },
    ],
  },
] as const;

export function DocsNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="mt-4 first:mt-0">
          <p className="px-2 pb-1.5 text-[12px] font-medium text-muted-foreground/70">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-lg px-2 py-1.5 text-sm transition-colors duration-150",
                      active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

export function PlaygroundCta({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-border/50 p-2">
      <Link
        href="/playground"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-[calc(1rem-0.5rem)] bg-foreground px-3 py-3 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-85"
      >
        <Shapes aria-hidden className="size-4" />
        Playground
      </Link>
    </div>
  );
}

export function DocsSidebar() {
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = scrollEl;
    if (!el) return;
    const update = () => {
      const top = el.scrollTop > 4;
      const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > 4;
      el.style.setProperty("--fade-top", top ? "1" : "0");
      el.style.setProperty("--fade-bottom", bottom ? "1" : "0");
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollEl]);

  return (
    <aside className="fixed top-4 bottom-4 left-4 z-40 hidden w-60 flex-col rounded-2xl border border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150 [view-transition-name:docs-sidebar] lg:flex">
      <div className="px-5 pt-5 pb-4">
        <Link
          href="/"
          aria-label="Canvas UI home"
          className="inline-block transition-opacity duration-150 hover:opacity-70"
        >
          <SiteLogo />
        </Link>
      </div>

      <nav
        ref={setScrollEl}
        aria-label="Docs"
        className="demo-controls-scroll docs-sidebar-scroll flex-1 overflow-y-auto pr-4 pb-5 pl-3"
      >
        <DocsNavList />
      </nav>

      <PlaygroundCta />
    </aside>
  );
}
