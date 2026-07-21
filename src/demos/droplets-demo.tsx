"use client";

import { useState, type ReactNode } from "react";

import {
  ColorRow,
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Droplets } from "@/lib/Droplets/Droplets";

type DropletsValues = {
  intensity: number;
  speed: number;
  scale: number;
  dropWidth: number;
  dropLength: number;
  refraction: number;
  blur: number;
  vignette: number;
  fallSpeed: number;
  wiggle: number;
  staticDrops: number;
  interactionRadius: number;
  interactionStrength: number;
  interactionDistortion: number;
  tintStrength: number;
};

const DEFAULT_VALUES: DropletsValues = {
  intensity: 0.5,
  speed: 1,
  scale: 0.4,
  dropWidth: 1,
  dropLength: 1,
  refraction: 0.2,
  blur: 0,
  vignette: 0,
  fallSpeed: 1,
  wiggle: 1,
  staticDrops: 0.2,
  interactionRadius: 0.3,
  interactionStrength: 0.6,
  interactionDistortion: 3,
  tintStrength: 0,
};

const CONTROLS: ScrubberDef<keyof DropletsValues>[] = [
  {
    key: "intensity",
    label: "Intensity",
    min: 0,
    max: 1.25,
    step: 0.05,
    decimals: 2,
  },
  { key: "speed", label: "Speed", min: 0, max: 3, step: 0.1, decimals: 1 },
  { key: "scale", label: "Scale", min: 0.4, max: 2.5, step: 0.05, decimals: 2 },
  {
    key: "dropWidth",
    label: "Drop width",
    min: 0.4,
    max: 1.5,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "dropLength",
    label: "Drop length",
    min: 0.4,
    max: 2.5,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "refraction",
    label: "Refraction",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  { key: "blur", label: "Blur", min: 0, max: 4, step: 0.1, decimals: 1 },
  {
    key: "vignette",
    label: "Vignette",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "fallSpeed",
    label: "Fall speed",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  { key: "wiggle", label: "Wiggle", min: 0, max: 2, step: 0.1, decimals: 1 },
  {
    key: "staticDrops",
    label: "Static drops",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "interactionRadius",
    label: "Wipe radius",
    min: 0.02,
    max: 0.4,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "interactionStrength",
    label: "Wipe strength",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "interactionDistortion",
    label: "Wipe distort",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "tintStrength",
    label: "Tint strength",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
];

const DEFAULT_TINT = "#8fb4ff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function DropletsDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<DropletsValues>(DEFAULT_VALUES);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    tint === DEFAULT_TINT && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Droplets
        {...values}
        tint={hexToRgb(tint)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Droplets>

      <DemoControls
        title="Droplets controls"
        snippet={{
          component: "Droplets",
          props: { ...values, tint: hexToRgb(tint) },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setTint(DEFAULT_TINT);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow label="Tint" value={tint} onValueChange={setTint} />
      </DemoControls>
    </>
  );
}
