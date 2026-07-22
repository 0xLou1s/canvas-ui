"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  RadioRow,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Ripple } from "@/lib/Ripple/Ripple";
import type { RippleTrigger } from "@/lib/Ripple/RippleVanilla";

type RippleValues = {
  amplitude: number;
  speed: number;
  wavelength: number;
  rings: number;
  decay: number;
  refraction: number;
  dispersion: number;
  shine: number;
  interval: number;
};

const DEFAULT_VALUES: RippleValues = {
  amplitude: 0.5,
  speed: 0.65,
  wavelength: 80,
  rings: 2,
  decay: 1,
  refraction: 100,
  dispersion: 0.5,
  shine: 0.5,
  interval: 0,
};

const DEFAULT_TRIGGER: RippleTrigger = "click";

const CONTROLS: ScrubberDef<keyof RippleValues>[] = [
  {
    key: "amplitude",
    label: "Amplitude",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "speed", label: "Speed", min: 0.2, max: 3, step: 0.05, decimals: 2 },
  {
    key: "wavelength",
    label: "Wavelength",
    min: 8,
    max: 80,
    step: 1,
    decimals: 0,
  },
  { key: "rings", label: "Rings", min: 1, max: 8, step: 1, decimals: 0 },
  { key: "decay", label: "Decay", min: 0.2, max: 3, step: 0.05, decimals: 2 },
  {
    key: "refraction",
    label: "Refraction",
    min: 0,
    max: 160,
    step: 2,
    decimals: 0,
  },
  {
    key: "dispersion",
    label: "Dispersion",
    min: 0,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  { key: "shine", label: "Shine", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "interval",
    label: "Interval",
    min: 0,
    max: 5,
    step: 0.25,
    decimals: 2,
  },
];

const TRIGGERS: { value: RippleTrigger; label: string }[] = [
  { value: "click", label: "Click" },
  { value: "hover", label: "Hover" },
  { value: "none", label: "None" },
];

export function RippleDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<RippleValues>(DEFAULT_VALUES);
  const [trigger, setTrigger] = useState<RippleTrigger>(DEFAULT_TRIGGER);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    trigger === DEFAULT_TRIGGER && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Ripple
        {...values}
        trigger={trigger}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Ripple>

      <DemoControls
        title="Ripple controls"
        snippet={{
          component: "Ripple",
          props: { ...values, trigger },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setTrigger(DEFAULT_TRIGGER);
        }}
      >
        <RadioRow
          label="Trigger"
          options={TRIGGERS}
          value={trigger}
          onValueChange={setTrigger}
        />
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
