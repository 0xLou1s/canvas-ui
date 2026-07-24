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
import { Frost } from "@/lib/Frost/Frost";

type FrostValues = {
  frost: number;
  strength: number;
  contrast: number;
  crispness: number;
  highlight: number;
  haze: number;
  tintStrength: number;
  refraction: number;
  detail: number;
  textureScale: number;
  meltRadius: number;
  meltNoise: number;
  meltStrength: number;
  refreeze: number;
  opacity: number;
  shimmer: number;
};

const DEFAULT_VALUES: FrostValues = {
  frost: 0.05,
  strength: 0.7,
  contrast: 3,
  crispness: 1,
  highlight: 0.3,
  haze: 0.5,
  tintStrength: 0.3,
  refraction: 1,
  detail: 2,
  textureScale: 2,
  meltRadius: 0.25,
  meltNoise: 0.25,
  meltStrength: 0.75,
  refreeze: 2,
  opacity: 0.6,
  shimmer: 0,
};

const CONTROLS: ScrubberDef<keyof FrostValues>[] = [
  { key: "frost", label: "Frost", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "strength",
    label: "Strength",
    min: 0,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: 0.5,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "crispness",
    label: "Crispness",
    min: 0.5,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "highlight",
    label: "Highlight",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "haze", label: "Haze", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "tintStrength",
    label: "Tint",
    min: 0,
    max: 1,
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
  { key: "detail", label: "Detail", min: 0, max: 6, step: 0.1, decimals: 1 },
  {
    key: "textureScale",
    label: "Texture scale",
    min: 0.3,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "meltRadius",
    label: "Melt radius",
    min: 0.05,
    max: 0.5,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "meltNoise",
    label: "Melt noise",
    min: 0,
    max: 0.5,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "meltStrength",
    label: "Melt speed",
    min: 0.05,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "refreeze",
    label: "Refreeze",
    min: 0,
    max: 10,
    step: 0.5,
    decimals: 1,
  },
  {
    key: "opacity",
    label: "Opacity",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "shimmer",
    label: "Shimmer",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
];

const DEFAULT_TINT_THIN = "#d1dbff";
const DEFAULT_TINT_THICK = "#eaf5ff";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function FrostDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<FrostValues>(DEFAULT_VALUES);
  const [tintThin, setTintThin] = useState(DEFAULT_TINT_THIN);
  const [tintThick, setTintThick] = useState(DEFAULT_TINT_THICK);
  const [meltEdges, setMeltEdges] = useState(true);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    tintThin === DEFAULT_TINT_THIN &&
    tintThick === DEFAULT_TINT_THICK &&
    meltEdges &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Frost
        {...values}
        meltEdges={meltEdges}
        tintThin={hexToRgb(tintThin)}
        tintThick={hexToRgb(tintThick)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Frost>

      <DemoControls
        title="Frost controls"
        snippet={{
          component: "Frost",
          props: {
            ...values,
            meltEdges,
            tintThin: hexToRgb(tintThin),
            tintThick: hexToRgb(tintThick),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setTintThin(DEFAULT_TINT_THIN);
          setTintThick(DEFAULT_TINT_THICK);
          setMeltEdges(true);
        }}
      >
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <SwitchRow
          label="Melt edges"
          checked={meltEdges}
          onCheckedChange={setMeltEdges}
        />
        <ColorRow
          label="Tint thin"
          value={tintThin}
          onValueChange={setTintThin}
        />
        <ColorRow
          label="Tint thick"
          value={tintThick}
          onValueChange={setTintThick}
        />
      </DemoControls>
    </>
  );
}
