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
import { Asciify, type AsciifyCharset } from "@/lib/Asciify/Asciify";

type AsciifyValues = {
  radius: number;
  softness: number;
  scale: number;
  spacing: number;
  backgroundOpacity: number;
  contrast: number;
  brightness: number;
  invert: number;
  strength: number;
  baseStrength: number;
  followSpeed: number;
};

const DEFAULT_VALUES: AsciifyValues = {
  radius: 0.4,
  softness: 1,
  scale: 2,
  spacing: 1,
  backgroundOpacity: 0,
  contrast: 1,
  brightness: 0,
  invert: 0,
  strength: 1,
  baseStrength: 0,
  followSpeed: 3,
};

const CHARSETS = [
  { value: "ascii", label: "Ascii" },
  { value: "blocks", label: "Blocks" },
  { value: "binary", label: "Binary" },
] as const;

const CONTROLS: ScrubberDef<keyof AsciifyValues>[] = [
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
  { key: "scale", label: "Scale", min: 1, max: 6, step: 0.5, decimals: 1 },
  { key: "spacing", label: "Spacing", min: 0, max: 3, step: 1, decimals: 0 },
  {
    key: "backgroundOpacity",
    label: "Bg opacity",
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
  { key: "invert", label: "Invert", min: 0, max: 1, step: 0.05, decimals: 2 },
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

const DEFAULT_CHARSET: AsciifyCharset = "ascii";
const DEFAULT_BACKGROUND = "#000000";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function AsciifyDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<AsciifyValues>(DEFAULT_VALUES);
  const [charset, setCharset] = useState<AsciifyCharset>(DEFAULT_CHARSET);
  const [background, setBackground] = useState(DEFAULT_BACKGROUND);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    charset === DEFAULT_CHARSET &&
    background === DEFAULT_BACKGROUND &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Asciify
        {...values}
        charset={charset}
        background={hexToRgb(background)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Asciify>

      <DemoControls
        title="Asciify controls"
        snippet={{
          component: "Asciify",
          props: { ...values, charset, background: hexToRgb(background) },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setCharset(DEFAULT_CHARSET);
          setBackground(DEFAULT_BACKGROUND);
        }}
      >
        <RadioRow
          label="Charset"
          options={CHARSETS}
          value={charset}
          onValueChange={setCharset}
        />
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            setValues((prev) => ({ ...prev, [key]: next }))
          }
        />
        <ColorRow
          label="Background"
          value={background}
          onValueChange={setBackground}
          onReset={
            background !== DEFAULT_BACKGROUND
              ? () => setBackground(DEFAULT_BACKGROUND)
              : undefined
          }
        />
      </DemoControls>
    </>
  );
}
