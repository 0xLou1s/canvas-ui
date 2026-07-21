"use client";

import { useLayoutEffect, useState } from "react";

import {
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { MockSite } from "@/components/playground/mock-site";
import { ParticleReveal } from "@/lib/ParticleReveal/ParticleReveal";

type Values = {
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

const DEFAULT_VALUES: Values = {
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

const CONTROLS: ScrubberDef<keyof Values>[] = [
  { key: "radius", label: "Radius", min: 60, max: 900, step: 10, decimals: 0 },
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

export function ParticleRevealEntry() {
  const [values, setValues] = useState<Values>(DEFAULT_VALUES);
  const [pageBg, setPageBg] = useState("#000000");
  const setContentEl = useDemoScrollbarGutter();

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

  return (
    <>
      <ParticleReveal
        {...values}
        background={pageBg}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          <MockSite />
        </div>
      </ParticleReveal>

      <DemoControls
        title="Particle Reveal controls"
        snippet={{
          component: "ParticleReveal",
          props: { ...values, background: pageBg },
        }}
        isDefault={valuesAreDefault(values, DEFAULT_VALUES)}
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
    </>
  );
}
