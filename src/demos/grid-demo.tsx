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
import { Grid } from "@/lib/Grid/Grid";

type GridValues = {
  tileSize: number;
  gap: number;
  cornerRadius: number;
  amplitude: number;
  waveSpeed: number;
  frequency: number;
  waveWidth: number;
  fadeTime: number;
  maxLift: number;
  jitter: number;
  liftHeight: number;
  perspective: number;
  tilt: number;
  shading: number;
  tintStrength: number;
  idleRipples: number;
};

const DEFAULT_VALUES: GridValues = {
  tileSize: 150,
  gap: 0,
  cornerRadius: 0,
  amplitude: 2.5,
  waveSpeed: 0.5,
  frequency: 12,
  waveWidth: 0.05,
  fadeTime: 0.2,
  maxLift: 1,
  jitter: 0,
  liftHeight: 60,
  perspective: 1200,
  tilt: 1,
  shading: 0.05,
  tintStrength: 0.1,
  idleRipples: 0,
};

const CONTROLS: ScrubberDef<keyof GridValues>[] = [
  {
    key: "tileSize",
    label: "Tile size",
    min: 16,
    max: 160,
    step: 2,
    decimals: 0,
  },
  { key: "gap", label: "Gap", min: 0, max: 12, step: 0.5, decimals: 1 },
  {
    key: "cornerRadius",
    label: "Corner radius",
    min: 0,
    max: 24,
    step: 1,
    decimals: 0,
  },
  {
    key: "amplitude",
    label: "Amplitude",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "waveSpeed",
    label: "Wave speed",
    min: 0.1,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "frequency",
    label: "Frequency",
    min: 1,
    max: 40,
    step: 0.5,
    decimals: 1,
  },
  {
    key: "waveWidth",
    label: "Wave width",
    min: 0.02,
    max: 0.5,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "fadeTime",
    label: "Fade time",
    min: 0.2,
    max: 6,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "maxLift",
    label: "Max lift",
    min: 0.1,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "jitter", label: "Jitter", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "liftHeight",
    label: "Lift height",
    min: 0,
    max: 160,
    step: 2,
    decimals: 0,
  },
  {
    key: "perspective",
    label: "Perspective",
    min: 300,
    max: 4000,
    step: 50,
    decimals: 0,
  },
  { key: "tilt", label: "Tilt", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "shading", label: "Shading", min: 0, max: 2, step: 0.05, decimals: 2 },
  {
    key: "tintStrength",
    label: "Tint strength",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "idleRipples",
    label: "Idle ripples",
    min: 0,
    max: 6,
    step: 0.5,
    decimals: 1,
  },
];

const DEFAULT_TINT = "#0055ff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function GridDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<GridValues>(DEFAULT_VALUES);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    tint === DEFAULT_TINT && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Grid
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
      </Grid>

      <DemoControls
        title="Grid controls"
        snippet={{
          component: "Grid",
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
