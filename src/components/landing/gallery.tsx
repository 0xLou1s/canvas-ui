import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { MarqueeTrack } from "@/components/landing/marquee-track";
import { Stitches } from "@/components/landing/stitches";
import { PreviewVideo } from "@/components/common/preview-video";
import { COMPONENTS, type ComponentEntry } from "@/data/components";

const MID = Math.ceil(COMPONENTS.length / 2);
const ROWS: {
  items: ComponentEntry[];
  direction?: "reverse";
  duration: string;
}[] = [
  { items: COMPONENTS.slice(0, MID), duration: "80s" },
  { items: COMPONENTS.slice(MID), direction: "reverse", duration: "96s" },
];

function GalleryCard({ component }: { component: ComponentEntry }) {
  return (
    <Link
      href={component.href}
      className="group block w-64 shrink-0 rounded-2xl border border-border/60 bg-muted/30 p-2 transition-colors duration-150 hover:bg-muted/50 sm:w-72"
    >
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/70 bg-background/60">
        <PreviewVideo
          src={component.video}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <h3 className="text-[15px] font-medium tracking-tight text-white">
            {component.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-white/70">
            {component.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Gallery() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative border-t border-dashed border-border/60 py-24 sm:py-32"
    >
      <Stitches />
      <Reveal className="flex w-full flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 sm:px-8">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            The library
          </p>
          <h2
            id="gallery-heading"
            className="mt-3 text-3xl font-medium tracking-tighter text-balance sm:text-4xl"
          >
            Every component, alive on canvas.
          </h2>
        </div>
        <Link
          href="/components"
          className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground transition-colors duration-150 hover:text-muted-foreground"
        >
          Browse all
          <ArrowRight
            aria-hidden
            strokeWidth={2.25}
            className="size-[15px] transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </Reveal>

      <Reveal delay={80} className="mt-12 flex flex-col gap-4">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="marquee">
            <MarqueeTrack direction={row.direction} duration={row.duration}>
              {row.items.map((component) => (
                <li key={component.href}>
                  <GalleryCard component={component} />
                </li>
              ))}
            </MarqueeTrack>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
