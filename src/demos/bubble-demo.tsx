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
import { Bubble } from "@/lib/Bubble/Bubble";

type BubbleValues = {
  size: number;
  trail: number;
  follow: number;
  blend: number;
  speed: number;
  refraction: number;
  dispersion: number;
  frost: number;
  shine: number;
  rim: number;
  iridescence: number;
  intensity: number;
  tintStrength: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const DEFAULT_TINT = "#ffffff";
const DEFAULT_COLOR_A = "#4a74b8";
const DEFAULT_COLOR_B = "#69696a";

const DEFAULT_VALUES: BubbleValues = {
  size: 30,
  trail: 24,
  follow: 0.5,
  blend: 14,
  speed: 2,
  refraction: 80,
  dispersion: 1,
  frost: 0,
  shine: 0.25,
  rim: 0.5,
  iridescence: 1,
  intensity: 0.9,
  tintStrength: 0,
};

const CONTROLS: ScrubberDef<keyof BubbleValues>[] = [
  { key: "size", label: "Size", min: 12, max: 140, step: 2, decimals: 0 },
  { key: "trail", label: "Trail", min: 1, max: 24, step: 1, decimals: 0 },
  {
    key: "follow",
    label: "Follow",
    min: 0.02,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  { key: "blend", label: "Blend", min: 1, max: 24, step: 0.5, decimals: 1 },
  { key: "speed", label: "Speed", min: 0, max: 6, step: 0.1, decimals: 1 },
  {
    key: "refraction",
    label: "Refraction",
    min: -120,
    max: 120,
    step: 2,
    decimals: 0,
  },
  {
    key: "dispersion",
    label: "Dispersion",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "frost", label: "Frost", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "shine", label: "Shine", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "rim", label: "Rim", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "iridescence",
    label: "Iridescence",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "intensity",
    label: "Intensity",
    min: 0,
    max: 5,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "tintStrength",
    label: "Tint strength",
    min: 0,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
];

export function BubbleDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<BubbleValues>(DEFAULT_VALUES);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [colorA, setColorA] = useState(DEFAULT_COLOR_A);
  const [colorB, setColorB] = useState(DEFAULT_COLOR_B);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    tint === DEFAULT_TINT &&
    colorA === DEFAULT_COLOR_A &&
    colorB === DEFAULT_COLOR_B &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Bubble
        {...values}
        tint={hexToRgb(tint)}
        colorA={hexToRgb(colorA)}
        colorB={hexToRgb(colorB)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Bubble>

      <DemoControls
        title="Bubble controls"
        snippet={{
          component: "Bubble",
          props: {
            ...values,
            tint: hexToRgb(tint),
            colorA: hexToRgb(colorA),
            colorB: hexToRgb(colorB),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setTint(DEFAULT_TINT);
          setColorA(DEFAULT_COLOR_A);
          setColorB(DEFAULT_COLOR_B);
        }}
      >
        <ColorRow label="Tint" value={tint} onValueChange={setTint} />
        <ColorRow label="Sheen A" value={colorA} onValueChange={setColorA} />
        <ColorRow label="Sheen B" value={colorB} onValueChange={setColorB} />
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
