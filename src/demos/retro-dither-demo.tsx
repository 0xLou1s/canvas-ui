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
import { RetroDither } from "@/lib/RetroDither/RetroDither";

type RetroDitherValues = {
  radius: number;
  softness: number;
  pixelSize: number;
  levels: number;
  colorize: number;
  contrast: number;
  brightness: number;
  strength: number;
  baseStrength: number;
  invert: number;
  scanlines: number;
  followSpeed: number;
};

const DEFAULT_VALUES: RetroDitherValues = {
  radius: 0.5,
  softness: 1,
  pixelSize: 2,
  levels: 4,
  colorize: 0.1,
  contrast: 0.6,
  brightness: 0,
  strength: 0.75,
  baseStrength: 0,
  invert: 0,
  scanlines: 0,
  followSpeed: 3,
};

const CONTROLS: ScrubberDef<keyof RetroDitherValues>[] = [
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
    key: "pixelSize",
    label: "Pixel size",
    min: 1,
    max: 12,
    step: 1,
    decimals: 0,
  },
  { key: "levels", label: "Levels", min: 1, max: 8, step: 1, decimals: 0 },
  {
    key: "colorize",
    label: "Colorize",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: 0.5,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "brightness",
    label: "Brightness",
    min: -0.5,
    max: 0.5,
    step: 0.05,
    decimals: 2,
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
  { key: "invert", label: "Invert", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "scanlines",
    label: "Scanlines",
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

const DEFAULT_DARK = "#000000";
const DEFAULT_LIGHT = "#ffffff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function RetroDitherDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<RetroDitherValues>(DEFAULT_VALUES);
  const [dark, setDark] = useState(DEFAULT_DARK);
  const [light, setLight] = useState(DEFAULT_LIGHT);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    dark === DEFAULT_DARK &&
    light === DEFAULT_LIGHT &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <RetroDither
        {...values}
        darkColor={hexToRgb(dark)}
        lightColor={hexToRgb(light)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </RetroDither>

      <DemoControls
        title="Retro Dither controls"
        snippet={{
          component: "RetroDither",
          props: {
            ...values,
            darkColor: hexToRgb(dark),
            lightColor: hexToRgb(light),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setDark(DEFAULT_DARK);
          setLight(DEFAULT_LIGHT);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow label="Dark" value={dark} onValueChange={setDark} />
        <ColorRow label="Light" value={light} onValueChange={setLight} />
      </DemoControls>
    </>
  );
}
