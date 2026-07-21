"use client";

import { Send } from "lucide-react";
import { useLayoutEffect, useState } from "react";

import {
  DemoControls,
  ScrubberRows,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParticleReveal } from "@/lib/ParticleReveal/ParticleReveal";

type ParticleRevealValues = {
  radius: number;
  softness: number;
  size: number;
  scatter: number;
  drift: number;
  aberration: number;
  bend: number;
  fade: number;
  threshold: number;
  smoothing: number;
};

const DEFAULT_VALUES: ParticleRevealValues = {
  radius: 500,
  softness: 0.75,
  size: 1,
  scatter: 25,
  drift: 1,
  aberration: 40,
  bend: 50,
  fade: 0.85,
  threshold: 0.1,
  smoothing: 0.25,
};

const CONTROLS: ScrubberDef<keyof ParticleRevealValues>[] = [
  { key: "radius", label: "Radius", min: 60, max: 600, step: 10, decimals: 0 },
  {
    key: "softness",
    label: "Softness",
    min: 0.05,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "size", label: "Size", min: 0.5, max: 3, step: 0.25, decimals: 2 },
  { key: "scatter", label: "Scatter", min: 0, max: 200, step: 5, decimals: 0 },
  { key: "drift", label: "Drift", min: 0, max: 2, step: 0.1, decimals: 1 },
  {
    key: "aberration",
    label: "Aberration",
    min: 0,
    max: 80,
    step: 2,
    decimals: 0,
  },
  { key: "bend", label: "Bend", min: 0, max: 240, step: 10, decimals: 0 },
  { key: "fade", label: "Fade", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "threshold",
    label: "Threshold",
    min: 0,
    max: 0.3,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "smoothing",
    label: "Smoothing",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
];

const AVATAR_URL =
  "https://pbs.twimg.com/profile_images/2077672716639862784/KpSO9Y3A_400x400.jpg";

function ContactScene() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-4 py-6 sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_URL}
              crossOrigin="anonymous"
              alt="David's profile picture"
              className="size-11 shrink-0 rounded-full border border-border/60 object-cover"
            />
            <div className="min-w-0">
              <CardTitle>Contact David</CardTitle>
              <CardDescription className="mt-0.5">
                Typically replies within a day
              </CardDescription>
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-emerald-500"
              />
              Online
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pr-name">Name</Label>
              <Input id="pr-name" placeholder="Ada Lovelace" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pr-email">Email</Label>
              <Input id="pr-email" placeholder="ada@example.com" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pr-message">Message</Label>
            <Textarea
              id="pr-message"
              placeholder="Hey David, I have an idea for a new canvas component..."
              className="min-h-24 resize-none"
            />
          </div>
          <Button className="w-full">
            <Send aria-hidden className="size-3.5" />
            Send message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ParticleRevealDemo() {
  const [values, setValues] = useState<ParticleRevealValues>(DEFAULT_VALUES);
  const [pageBg, setPageBg] = useState("#000000");

  useLayoutEffect(() => {
    const read = () =>
      setPageBg(getComputedStyle(document.body).backgroundColor);
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const isDefault = valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <section className="mt-8" aria-label="Demo">
      <div className="relative h-130 touch-none overflow-hidden rounded-xl border border-border/60 bg-background">
        <ParticleReveal
          {...values}
          background={pageBg}
          className="inset-0"
          style={{ position: "absolute" }}
        >
          <ContactScene />
        </ParticleReveal>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Move your cursor over the scene to reveal the UI.
      </p>

      <DemoControls
        title="Particle Reveal controls"
        snippet={{ component: "ParticleReveal", props: { ...values } }}
        isDefault={isDefault}
        portal
        onReset={() => setValues(DEFAULT_VALUES)}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
      </DemoControls>
    </section>
  );
}
