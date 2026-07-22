"use client";

import { useState, type ReactNode } from "react";

import {
  ColorRow,
  DemoControls,
  RadioRow,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { HexFloat } from "@/lib/HexFloat/HexFloat";

type HexFloatValues = {
  size: number;
  gap: number;
  bevel: number;
  tilt: number;
  perspective: number;
  float: number;
  speed: number;
  shine: number;
  lift: number;
  radius: number;
  flow: number;
  swirl: number;
  trail: number;
  iridescence: number;
  bloom: number;
  grain: number;
};

const DEFAULT_VALUES: HexFloatValues = {
  size: 160,
  gap: 0,
  bevel: 1.5,
  tilt: 24,
  perspective: 0.5,
  float: 0,
  speed: 1,
  shine: 0.5,
  lift: 0.1,
  radius: 1200,
  flow: 0,
  swirl: 0,
  trail: 0,
  iridescence: 1,
  bloom: 0,
  grain: 0.8,
};

type GapMode = "auto" | "custom";

const DEFAULT_GAP_MODE: GapMode = "auto";
const DEFAULT_GAP_COLOR = "#101014";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const CONTROLS: ScrubberDef<keyof HexFloatValues>[] = [
  { key: "size", label: "Size", min: 24, max: 160, step: 2, decimals: 0 },
  { key: "gap", label: "Gap", min: 0, max: 12, step: 0.5, decimals: 1 },
  { key: "bevel", label: "Bevel", min: 0, max: 20, step: 0.5, decimals: 1 },
  { key: "tilt", label: "Tilt", min: -30, max: 30, step: 1, decimals: 0 },
  {
    key: "perspective",
    label: "Perspective",
    min: 0,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  { key: "float", label: "Float", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "speed", label: "Speed", min: 0.1, max: 3, step: 0.05, decimals: 2 },
  { key: "shine", label: "Shine", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "lift", label: "Lift", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "radius",
    label: "Radius",
    min: 60,
    max: 1400,
    step: 20,
    decimals: 0,
  },
  { key: "flow", label: "Flow", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "swirl", label: "Swirl", min: 0, max: 15, step: 0.5, decimals: 1 },
  { key: "trail", label: "Trail", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "iridescence",
    label: "Iridescence",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  { key: "bloom", label: "Bloom", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "grain", label: "Grain", min: 0, max: 1, step: 0.02, decimals: 2 },
];

const GAP_MODES: { value: GapMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "custom", label: "Custom" },
];

export function HexFloatDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<HexFloatValues>(DEFAULT_VALUES);
  const [gapMode, setGapMode] = useState<GapMode>(DEFAULT_GAP_MODE);
  const [gapHex, setGapHex] = useState(DEFAULT_GAP_COLOR);
  const setContentEl = useDemoScrollbarGutter();

  const gapColor: [number, number, number] | "auto" =
    gapMode === "auto" ? "auto" : hexToRgb(gapHex);

  const isDefault =
    gapMode === DEFAULT_GAP_MODE &&
    gapHex === DEFAULT_GAP_COLOR &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <HexFloat
        {...values}
        gapColor={gapColor}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </HexFloat>

      <DemoControls
        title="Hex Float controls"
        snippet={{
          component: "HexFloat",
          props: { ...values, gapColor },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setGapMode(DEFAULT_GAP_MODE);
          setGapHex(DEFAULT_GAP_COLOR);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <RadioRow
          label="Seam"
          options={GAP_MODES}
          value={gapMode}
          onValueChange={setGapMode}
        />
        {gapMode === "custom" ? (
          <ColorRow label="Seam color" value={gapHex} onValueChange={setGapHex} />
        ) : null}
      </DemoControls>
    </>
  );
}
