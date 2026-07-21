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
import { Clouds } from "@/lib/Clouds/Clouds";

type CloudsValues = {
  scale: number;
  speed: number;
  cover: number;
  density: number;
  shading: number;
  opacity: number;
  shadow: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowSoftness: number;
  wind: number;
  windRadius: number;
  refraction: number;
  fogBlur: number;
  quality: number;
};

const DEFAULT_VALUES: CloudsValues = {
  scale: 1,
  speed: 0.6,
  cover: 0.1,
  density: 2.5,
  shading: 0.1,
  opacity: 0.64,
  shadow: 0.06,
  shadowOffsetX: 200,
  shadowOffsetY: -10,
  shadowSoftness: 1,
  wind: 0.6,
  windRadius: 350,
  refraction: 0,
  fogBlur: 0,
  quality: 1,
};

const CONTROLS: ScrubberDef<keyof CloudsValues>[] = [
  { key: "scale", label: "Scale", min: 0.3, max: 3, step: 0.05, decimals: 2 },
  { key: "speed", label: "Speed", min: 0, max: 5, step: 0.1, decimals: 1 },
  { key: "cover", label: "Cover", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "density", label: "Density", min: 0, max: 16, step: 0.5, decimals: 1 },
  { key: "shading", label: "Shading", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "opacity", label: "Opacity", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "shadow", label: "Shadow", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "shadowOffsetX",
    label: "Shadow X",
    min: -300,
    max: 300,
    step: 10,
    decimals: 0,
  },
  {
    key: "shadowOffsetY",
    label: "Shadow Y",
    min: -300,
    max: 300,
    step: 10,
    decimals: 0,
  },
  {
    key: "shadowSoftness",
    label: "Softness",
    min: 0,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  { key: "wind", label: "Wind", min: 0, max: 1, step: 0.02, decimals: 2 },
  {
    key: "windRadius",
    label: "Wind radius",
    min: 40,
    max: 400,
    step: 10,
    decimals: 0,
  },
  {
    key: "refraction",
    label: "Refraction",
    min: 0,
    max: 80,
    step: 1,
    decimals: 0,
  },
  {
    key: "fogBlur",
    label: "Fog blur",
    min: 0,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
  {
    key: "quality",
    label: "Quality",
    min: 0.2,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
];

const AUTO_COLOR = "auto";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function CloudsDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<CloudsValues>(DEFAULT_VALUES);
  const [color, setColor] = useState(AUTO_COLOR);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    color === AUTO_COLOR && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Clouds
        {...values}
        color={color === AUTO_COLOR ? "auto" : hexToRgb(color)}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Clouds>

      <DemoControls
        title="Clouds controls"
        snippet={{
          component: "Clouds",
          props: {
            ...values,
            color: color === AUTO_COLOR ? "auto" : hexToRgb(color),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setColor(AUTO_COLOR);
        }}
      >
        <ColorRow
          label="Color"
          value={color === AUTO_COLOR ? "#ffffff" : color}
          onValueChange={setColor}
          displayValue={color === AUTO_COLOR ? "Auto" : undefined}
          onReset={
            color !== AUTO_COLOR ? () => setColor(AUTO_COLOR) : undefined
          }
        />
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
