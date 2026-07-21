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
import { Magnify } from "@/lib/Magnify/Magnify";

type MagnifyValues = {
  size: number;
  zoom: number;
  follow: number;
  hud: number;
  aberration: number;
  haze: number;
  rippleSpeed: number;
  rippleWidth: number;
  rippleBendWidth: number;
  rippleBend: number;
  rippleGlow: number;
};

type MagnifyToggles = {
  ring: boolean;
  crosshair: boolean;
  ticks: boolean;
  brackets: boolean;
  dot: boolean;
  grid: boolean;
  readout: boolean;
  ripples: boolean;
};

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const DEFAULT_COLOR = "#cccccc";

const DEFAULT_VALUES: MagnifyValues = {
  size: 140,
  zoom: 1.5,
  follow: 0.25,
  hud: 0.8,
  aberration: 0.8,
  haze: 0.2,
  rippleSpeed: 900,
  rippleWidth: 2,
  rippleBendWidth: 100,
  rippleBend: 20,
  rippleGlow: 1,
};

const DEFAULT_TOGGLES: MagnifyToggles = {
  ring: true,
  crosshair: true,
  ticks: true,
  brackets: true,
  dot: true,
  grid: false,
  readout: true,
  ripples: true,
};

const TOGGLES: { key: keyof MagnifyToggles; label: string }[] = [
  { key: "ring", label: "Ring" },
  { key: "crosshair", label: "Crosshair" },
  { key: "ticks", label: "Ticks" },
  { key: "brackets", label: "Brackets" },
  { key: "dot", label: "Center dot" },
  { key: "grid", label: "Grid" },
  { key: "readout", label: "Readout" },
  { key: "ripples", label: "Click ripples" },
];

const CONTROLS: ScrubberDef<keyof MagnifyValues>[] = [
  { key: "size", label: "Size", min: 60, max: 260, step: 4, decimals: 0 },
  { key: "zoom", label: "Zoom", min: 1, max: 4, step: 0.05, decimals: 2 },
  {
    key: "follow",
    label: "Follow",
    min: 0.02,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  { key: "hud", label: "HUD", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "aberration",
    label: "Aberration",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "haze", label: "Haze", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "rippleSpeed",
    label: "Ripple speed",
    min: 200,
    max: 2400,
    step: 50,
    decimals: 0,
  },
  {
    key: "rippleWidth",
    label: "Ripple width",
    min: 0.5,
    max: 24,
    step: 0.5,
    decimals: 1,
  },
  {
    key: "rippleBendWidth",
    label: "Bend width",
    min: 10,
    max: 240,
    step: 5,
    decimals: 0,
  },
  {
    key: "rippleBend",
    label: "Ripple bend",
    min: 0,
    max: 120,
    step: 2,
    decimals: 0,
  },
  {
    key: "rippleGlow",
    label: "Ripple glow",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
];

export function MagnifyDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<MagnifyValues>(DEFAULT_VALUES);
  const [toggles, setToggles] = useState<MagnifyToggles>(DEFAULT_TOGGLES);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    color === DEFAULT_COLOR &&
    valuesAreDefault(values, DEFAULT_VALUES) &&
    TOGGLES.every(({ key }) => toggles[key] === DEFAULT_TOGGLES[key]);

  return (
    <>
      <Magnify
        {...values}
        {...toggles}
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
      </Magnify>

      <DemoControls
        title="Magnify controls"
        snippet={{
          component: "Magnify",
          props: { ...values, ...toggles, color: hexToRgb(color) },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
          setColor(DEFAULT_COLOR);
        }}
      >
        <ColorRow label="Accent" value={color} onValueChange={setColor} />
        {TOGGLES.map(({ key, label }) => (
          <SwitchRow
            key={key}
            label={label}
            checked={toggles[key]}
            onCheckedChange={(checked) =>
              setToggles((prev) => ({ ...prev, [key]: checked }))
            }
          />
        ))}
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
