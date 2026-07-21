"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  RadioRow,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Glass } from "@/lib/Glass/Glass";

type GlassShape = "circle" | "square" | "rectangle";

type GlassValues = {
  size: number;
  aspect: number;
  corner: number;
  ior: number;
  edge: number;
  bevel: number;
  depth: number;
  aberration: number;
  blur: number;
  reflection: number;
  shine: number;
  zoom: number;
  follow: number;
};

const DEFAULT_SHAPE: GlassShape = "circle";

const DEFAULT_VALUES: GlassValues = {
  size: 120,
  aspect: 1.7,
  corner: 32,
  ior: 1.5,
  edge: 0.7,
  bevel: 4,
  depth: 250,
  aberration: 1,
  blur: 0,
  reflection: 1,
  shine: 0.01,
  zoom: 1.5,
  follow: 0.2,
};

const SHAPES: { value: GlassShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "rectangle", label: "Rectangle" },
];

const CONTROLS: ScrubberDef<keyof GlassValues>[] = [
  { key: "size", label: "Size", min: 40, max: 280, step: 4, decimals: 0 },
  { key: "aspect", label: "Aspect", min: 1, max: 3, step: 0.05, decimals: 2 },
  { key: "corner", label: "Corner", min: 0, max: 120, step: 2, decimals: 0 },
  { key: "ior", label: "IOR", min: 1.05, max: 2, step: 0.01, decimals: 2 },
  { key: "edge", label: "Edge", min: 0, max: 0.95, step: 0.01, decimals: 2 },
  { key: "bevel", label: "Bevel", min: 1, max: 10, step: 0.25, decimals: 2 },
  { key: "depth", label: "Depth", min: 20, max: 800, step: 10, decimals: 0 },
  {
    key: "aberration",
    label: "Aberration",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  { key: "blur", label: "Blur", min: 0, max: 4, step: 0.1, decimals: 1 },
  {
    key: "reflection",
    label: "Reflection",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  { key: "shine", label: "Shine", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "zoom", label: "Zoom", min: 1, max: 3, step: 0.05, decimals: 2 },
  {
    key: "follow",
    label: "Follow",
    min: 0.02,
    max: 1,
    step: 0.02,
    decimals: 2,
  },
];

export function GlassDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<GlassValues>(DEFAULT_VALUES);
  const [shape, setShape] = useState<GlassShape>(DEFAULT_SHAPE);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    shape === DEFAULT_SHAPE && valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Glass
        {...values}
        shape={shape}
        targets="h1, h2, h3, a, button, code"
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Glass>

      <DemoControls
        title="Glass controls"
        snippet={{
          component: "Glass",
          props: { ...values, shape, targets: "h1, h2, h3, a, button, code" },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setShape(DEFAULT_SHAPE);
        }}
      >
        <RadioRow
          label="Lens shape"
          options={SHAPES}
          value={shape}
          onValueChange={setShape}
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
