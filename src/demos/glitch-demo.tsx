"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Glitch } from "@/lib/Glitch/Glitch";

type GlitchValues = {
  intensity: number;
  interval: number;
  duration: number;
  slices: number;
  shift: number;
  rgbShift: number;
  blocks: number;
  noise: number;
};

const DEFAULT_VALUES: GlitchValues = {
  intensity: 1,
  interval: 3,
  duration: 0.4,
  slices: 24,
  shift: 30,
  rgbShift: 4,
  blocks: 0.5,
  noise: 0.35,
};

const CONTROLS: ScrubberDef<keyof GlitchValues>[] = [
  {
    key: "intensity",
    label: "Intensity",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  { key: "interval", label: "Interval", min: 0, max: 8, step: 0.25, decimals: 2 },
  {
    key: "duration",
    label: "Duration",
    min: 0.1,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  { key: "slices", label: "Slices", min: 4, max: 80, step: 1, decimals: 0 },
  { key: "shift", label: "Shift", min: 0, max: 120, step: 2, decimals: 0 },
  {
    key: "rgbShift",
    label: "RGB Shift",
    min: 0,
    max: 20,
    step: 0.5,
    decimals: 1,
  },
  { key: "blocks", label: "Blocks", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "noise", label: "Noise", min: 0, max: 1, step: 0.02, decimals: 2 },
];

export function GlitchDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<GlitchValues>(DEFAULT_VALUES);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault = valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Glitch
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
      </Glitch>

      <DemoControls
        title="Glitch controls"
        snippet={{
          component: "Glitch",
          props: values,
        }}
        isDefault={isDefault}
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
