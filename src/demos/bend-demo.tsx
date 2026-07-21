"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  RadioRow,
  ScrubberRows,
  SwitchRow,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Bend } from "@/lib/Bend/Bend";

type BendValues = {
  zone: number;
  angle: number;
  rounding: number;
  perspective: number;
  ease: number;
  smoothing: number;
  tumble: number;
  tilt: number;
};

type BendDirection = "out" | "in";

const DEFAULT_VALUES: BendValues = {
  zone: 240,
  angle: 80,
  rounding: 150,
  perspective: 700,
  ease: 240,
  smoothing: 0.1,
  tumble: 0.5,
  tilt: 0.5,
};

const DEFAULT_DIRECTION: BendDirection = "in";

const DIRECTIONS: { value: BendDirection; label: string }[] = [
  { value: "out", label: "Outward" },
  { value: "in", label: "Inward" },
];

const CONTROLS: ScrubberDef<keyof BendValues>[] = [
  { key: "zone", label: "Zone", min: 60, max: 480, step: 10, decimals: 0 },
  { key: "angle", label: "Angle", min: 10, max: 160, step: 5, decimals: 0 },
  {
    key: "rounding",
    label: "Rounding",
    min: 0,
    max: 480,
    step: 10,
    decimals: 0,
  },
  {
    key: "perspective",
    label: "Perspective",
    min: 200,
    max: 2400,
    step: 50,
    decimals: 0,
  },
  { key: "ease", label: "Ease", min: 40, max: 800, step: 20, decimals: 0 },
  {
    key: "smoothing",
    label: "Smoothing",
    min: 0,
    max: 0.5,
    step: 0.01,
    decimals: 2,
  },
  { key: "tumble", label: "Tumble", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "tilt", label: "Tilt", min: 0, max: 1, step: 0.05, decimals: 2 },
];

export function BendDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<BendValues>(DEFAULT_VALUES);
  const [direction, setDirection] = useState<BendDirection>(DEFAULT_DIRECTION);
  const [edges, setEdges] = useState({ top: true, bottom: true });
  const setContentEl = useDemoScrollbarGutter();

  const isDefault =
    direction === DEFAULT_DIRECTION &&
    edges.top &&
    edges.bottom &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <Bend
        {...values}
        direction={direction}
        top={edges.top}
        bottom={edges.bottom}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </Bend>

      <DemoControls
        title="Bend controls"
        snippet={{
          component: "Bend",
          props: { ...values, direction, top: edges.top, bottom: edges.bottom },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setDirection(DEFAULT_DIRECTION);
          setEdges({ top: true, bottom: true });
        }}
      >
        <RadioRow
          label="Bend direction"
          options={DIRECTIONS}
          value={direction}
          onValueChange={setDirection}
        />
        <SwitchRow
          label="Top"
          checked={edges.top}
          onCheckedChange={(checked) =>
            setEdges((prev) => ({ ...prev, top: checked }))
          }
        />
        <SwitchRow
          label="Bottom"
          checked={edges.bottom}
          onCheckedChange={(checked) =>
            setEdges((prev) => ({ ...prev, bottom: checked }))
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
