"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { ParticleScroll } from "@/lib/ParticleScroll/ParticleScroll";

type ParticleScrollValues = {
  point: number;
  band: number;
  density: number;
  size: number;
  spread: number;
  gravity: number;
  drift: number;
  swirl: number;
  stagger: number;
  fade: number;
  settle: number;
  smoothing: number;
};

const DEFAULT_VALUES: ParticleScrollValues = {
  point: 0.68,
  band: 420,
  density: 2,
  size: 1.25,
  spread: 220,
  gravity: 0.35,
  drift: 0.7,
  swirl: 60,
  stagger: 0.7,
  fade: 0.85,
  settle: 1.2,
  smoothing: 0.6,
};

const CONTROLS: ScrubberDef<keyof ParticleScrollValues>[] = [
  { key: "point", label: "Point", min: 0.2, max: 1, step: 0.01, decimals: 2 },
  { key: "band", label: "Band", min: 60, max: 800, step: 20, decimals: 0 },
  {
    key: "density",
    label: "Density",
    min: 1.5,
    max: 8,
    step: 0.25,
    decimals: 2,
  },
  { key: "size", label: "Size", min: 0.5, max: 4, step: 0.25, decimals: 2 },
  { key: "spread", label: "Spread", min: 0, max: 800, step: 20, decimals: 0 },
  {
    key: "gravity",
    label: "Gravity",
    min: -1,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "drift", label: "Drift", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "swirl", label: "Swirl", min: 0, max: 300, step: 10, decimals: 0 },
  { key: "stagger", label: "Stagger", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "fade", label: "Fade", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "settle", label: "Settle", min: 0.2, max: 3, step: 0.05, decimals: 2 },
  {
    key: "smoothing",
    label: "Smoothing",
    min: 0,
    max: 1.5,
    step: 0.05,
    decimals: 2,
  },
];

export function ParticleScrollDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<ParticleScrollValues>(DEFAULT_VALUES);
  const setContentEl = useDemoScrollbarGutter();

  return (
    <>
      <ParticleScroll
        {...values}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </ParticleScroll>

      <DemoControls
        title="Particle Scroll controls"
        snippet={{ component: "ParticleScroll", props: { ...values } }}
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
