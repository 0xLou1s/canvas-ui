"use client";

import { useState, type ReactNode } from "react";

import {
  ColorRow,
  DemoControls,
  ScrubberRows,
  SwitchRow,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Liquid } from "@/lib/Liquid/Liquid";

type LiquidValues = {
  force: number;
  radius: number;
  curl: number;
  pressureIterations: number;
  pressure: number;
  intensity: number;
  distortion: number;
  blend: number;
  densityDissipation: number;
  velocityDissipation: number;
};

const DEFAULT_VALUES: LiquidValues = {
  force: 1.1,
  radius: 0.3,
  curl: 1.9,
  pressureIterations: 4,
  pressure: 0.8,
  intensity: 2,
  distortion: 0.4,
  blend: 5,
  densityDissipation: 0.96,
  velocityDissipation: 1,
};

const CONTROLS: ScrubberDef<keyof LiquidValues>[] = [
  { key: "force", label: "Force", min: 0, max: 5, step: 0.1, decimals: 1 },
  {
    key: "radius",
    label: "Radius",
    min: 0.05,
    max: 1.5,
    step: 0.05,
    decimals: 2,
  },
  { key: "curl", label: "Curl", min: 0, max: 10, step: 0.1, decimals: 1 },
  {
    key: "pressureIterations",
    label: "Swirl",
    min: 1,
    max: 10,
    step: 1,
    decimals: 0,
  },
  {
    key: "pressure",
    label: "Pressure",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "intensity",
    label: "Intensity",
    min: 0,
    max: 10,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "distortion",
    label: "Distortion",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  { key: "blend", label: "Blend", min: 0, max: 20, step: 0.5, decimals: 1 },
  {
    key: "densityDissipation",
    label: "Trail fade",
    min: 0.85,
    max: 1,
    step: 0.005,
    decimals: 3,
  },
  {
    key: "velocityDissipation",
    label: "Motion fade",
    min: 0.85,
    max: 1,
    step: 0.005,
    decimals: 3,
  },
];

const DEFAULT_COLOR = "#425bff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function LiquidDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<LiquidValues>(DEFAULT_VALUES);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [rainbow, setRainbow] = useState(false);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    !rainbow &&
    color === DEFAULT_COLOR &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Liquid
        {...values}
        color={hexToRgb(color)}
        rainbow={rainbow}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Liquid>

      <DemoControls
        title="Liquid controls"
        snippet={{
          component: "Liquid",
          props: { ...values, color: hexToRgb(color), rainbow },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setColor(DEFAULT_COLOR);
          setRainbow(false);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <div className={rainbow ? "pointer-events-none opacity-40" : ""}>
          <ColorRow label="Color" value={color} onValueChange={setColor} />
        </div>
        <SwitchRow
          label="Rainbow"
          checked={rainbow}
          onCheckedChange={setRainbow}
        />
      </DemoControls>
    </>
  );
}
