"use client";

import { useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

import {
  ColorRow,
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Shatter } from "@/lib/Shatter/Shatter";

type ShatterValues = {
  radius: number;
  softness: number;
  tileSize: number;
  shards: number;
  corner: number;
  lift: number;
  tilt: number;
  scatter: number;
  perspective: number;
  shadow: number;
  shading: number;
  refraction: number;
  dispersion: number;
  floatSpeed: number;
  strength: number;
  baseStrength: number;
  followSpeed: number;
};

const DEFAULT_VALUES: ShatterValues = {
  radius: 0.4,
  softness: 0.6,
  tileSize: 125,
  shards: 1,
  corner: 0,
  lift: 30,
  tilt: 2,
  scatter: 5,
  perspective: 1500,
  shadow: 0.5,
  shading: 0.5,
  refraction: 1.5,
  dispersion: 0.3,
  floatSpeed: 2,
  strength: 1,
  baseStrength: 0,
  followSpeed: 3,
};

const LIGHT_GAP = "#ffffff";
const DARK_GAP = "#0a0a0a";

const CONTROLS: ScrubberDef<keyof ShatterValues>[] = [
  {
    key: "radius",
    label: "Radius",
    min: 0.1,
    max: 0.8,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "softness",
    label: "Softness",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "tileSize",
    label: "Tile size",
    min: 40,
    max: 220,
    step: 5,
    decimals: 0,
  },
  {
    key: "shards",
    label: "Shards",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "corner", label: "Corner", min: 0, max: 30, step: 1, decimals: 0 },
  { key: "lift", label: "Lift", min: 0, max: 120, step: 2, decimals: 0 },
  { key: "tilt", label: "Tilt", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "scatter", label: "Scatter", min: 0, max: 30, step: 1, decimals: 0 },
  {
    key: "perspective",
    label: "Perspective",
    min: 300,
    max: 2000,
    step: 50,
    decimals: 0,
  },
  { key: "shadow", label: "Shadow", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "shading",
    label: "Shading",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "refraction",
    label: "Refraction",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "dispersion",
    label: "Dispersion",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "floatSpeed",
    label: "Float speed",
    min: 0,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "strength",
    label: "Strength",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "baseStrength",
    label: "Base strength",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "followSpeed",
    label: "Follow speed",
    min: 1,
    max: 20,
    step: 0.5,
    decimals: 1,
  },
];

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ];
}

export function ShatterDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<ShatterValues>(DEFAULT_VALUES);
  const [gap, setGap] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const setContentEl = useDemoScrollbarGutter();

  const themeGap = resolvedTheme === "dark" ? DARK_GAP : LIGHT_GAP;
  const effectiveGap = gap ?? themeGap;
  const isDefault = gap === null && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Shatter
        {...values}
        gapColor={hexToRgb(effectiveGap)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Shatter>

      <DemoControls
        title="Shatter controls"
        snippet={{
          component: "Shatter",
          props: { ...values, gapColor: hexToRgb(effectiveGap) },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setGap(null);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow
          label="Gap color"
          value={effectiveGap}
          onValueChange={setGap}
          onReset={gap !== null ? () => setGap(null) : undefined}
        />
      </DemoControls>
    </>
  );
}
