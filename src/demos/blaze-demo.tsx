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
import { Blaze } from "@/lib/Blaze/Blaze";

type BlazeValues = {
  height: number;
  distortion: number;
  distortionScale: number;
  speed: number;
  sparks: number;
  sparkDensity: number;
  sparkSize: number;
  layers: number;
  smoke: number;
  glow: number;
};

const DEFAULT_VALUES: BlazeValues = {
  height: 0.97,
  distortion: 0.6,
  distortionScale: 0.5,
  speed: 1,
  sparks: 0.5,
  sparkDensity: 1.5,
  sparkSize: 1,
  layers: 4,
  smoke: 0.5,
  glow: 1.5,
};

const CONTROLS: ScrubberDef<keyof BlazeValues>[] = [
  { key: "height", label: "Height", min: 0.1, max: 1, step: 0.01, decimals: 2 },
  {
    key: "distortion",
    label: "Distortion",
    min: 0,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "distortionScale",
    label: "Heat scale",
    min: 0.3,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "speed", label: "Speed", min: 0, max: 3, step: 0.1, decimals: 1 },
  { key: "sparks", label: "Sparks", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "sparkDensity",
    label: "Spark density",
    min: 0.3,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "sparkSize",
    label: "Spark size",
    min: 0.5,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "layers", label: "Layers", min: 1, max: 10, step: 1, decimals: 0 },
  { key: "smoke", label: "Smoke", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "glow", label: "Glow", min: 0, max: 3, step: 0.1, decimals: 1 },
];

const DEFAULT_SPARK = "#ff660d";
const DEFAULT_SMOKE = "#ff6e1a";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function BlazeDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<BlazeValues>(DEFAULT_VALUES);
  const [spark, setSpark] = useState(DEFAULT_SPARK);
  const [smoke, setSmoke] = useState(DEFAULT_SMOKE);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    spark === DEFAULT_SPARK &&
    smoke === DEFAULT_SMOKE &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Blaze
        {...values}
        sparkColor={hexToRgb(spark)}
        smokeColor={hexToRgb(smoke)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Blaze>

      <DemoControls
        title="Blaze controls"
        snippet={{
          component: "Blaze",
          props: {
            ...values,
            sparkColor: hexToRgb(spark),
            smokeColor: hexToRgb(smoke),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setSpark(DEFAULT_SPARK);
          setSmoke(DEFAULT_SMOKE);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow label="Spark" value={spark} onValueChange={setSpark} />
        <ColorRow label="Smoke" value={smoke} onValueChange={setSmoke} />
      </DemoControls>
    </>
  );
}
