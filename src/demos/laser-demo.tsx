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
import { Laser } from "@/lib/Laser/Laser";

type LaserValues = {
  speed: number;
  offset: number;
  thickness: number;
  core: number;
  radius: number;
  glow: number;
  wave: number;
  width: number;
  flicker: number;
  reveal: number;
  heat: number;
  shimmer: number;
  sparkle: number;
  reactivity: number;
};

const DEFAULT_VALUES: LaserValues = {
  speed: 0.3,
  offset: 140,
  thickness: 6,
  core: 1,
  radius: 20,
  glow: 2,
  wave: 10,
  width: 0.55,
  flicker: 0.2,
  reveal: 400,
  heat: 1.5,
  shimmer: 12,
  sparkle: 0.25,
  reactivity: 1,
};

const CONTROLS: ScrubberDef<keyof LaserValues>[] = [
  { key: "speed", label: "Speed", min: 0, max: 4, step: 0.1, decimals: 1 },
  { key: "offset", label: "Offset", min: 0, max: 400, step: 4, decimals: 0 },
  {
    key: "thickness",
    label: "Thickness",
    min: 0.5,
    max: 12,
    step: 0.5,
    decimals: 1,
  },
  { key: "core", label: "Core", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "radius", label: "Radius", min: 1, max: 60, step: 1, decimals: 0 },
  { key: "glow", label: "Glow", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "wave", label: "Wave", min: 0, max: 24, step: 0.5, decimals: 1 },
  { key: "width", label: "Width", min: 0.1, max: 1, step: 0.05, decimals: 2 },
  { key: "flicker", label: "Flicker", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "reveal", label: "Reveal", min: 0, max: 480, step: 8, decimals: 0 },
  { key: "heat", label: "Heat", min: 0, max: 1.5, step: 0.05, decimals: 2 },
  { key: "shimmer", label: "Shimmer", min: 0, max: 12, step: 0.5, decimals: 1 },
  { key: "sparkle", label: "Sparkle", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "reactivity",
    label: "Reactivity",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
];

const DEFAULT_COLOR = "#0d59ff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function LaserDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<LaserValues>(DEFAULT_VALUES);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    color === DEFAULT_COLOR && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Laser
        {...values}
        color={hexToRgb(color)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Laser>

      <DemoControls
        title="Laser controls"
        snippet={{
          component: "Laser",
          props: { ...values, color: hexToRgb(color) },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setColor(DEFAULT_COLOR);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow label="Color" value={color} onValueChange={setColor} />
      </DemoControls>
    </>
  );
}
