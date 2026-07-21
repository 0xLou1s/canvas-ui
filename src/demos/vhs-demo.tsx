"use client";

import { useState, type ReactNode } from "react";

import {
  DemoControls,
  ScrubberRows,
  useDemoScrollbarGutter,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { VHS } from "@/lib/VHS/VHS";

type VHSValues = {
  speed: number;
  wave: number;
  jitter: number;
  crease: number;
  switching: number;
  switchingHeight: number;
  bloom: number;
  aberration: number;
  acBeat: number;
  grain: number;
  scanlines: number;
  vignette: number;
  barrel: number;
  saturation: number;
  exposure: number;
};

const DEFAULT_VALUES: VHSValues = {
  speed: 0.5,
  wave: 1,
  jitter: 0.25,
  crease: 0.1,
  switching: 0.05,
  switchingHeight: 0.02,
  bloom: 0.4,
  aberration: 2,
  acBeat: 1,
  grain: 0.1,
  scanlines: 0.1,
  vignette: 0,
  barrel: 0,
  saturation: 1,
  exposure: 1,
};

const CONTROLS: ScrubberDef<keyof VHSValues>[] = [
  { key: "speed", label: "Speed", min: 0, max: 4, step: 0.1, decimals: 1 },
  { key: "wave", label: "Wave", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "jitter", label: "Jitter", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "crease", label: "Crease", min: 0, max: 3, step: 0.05, decimals: 2 },
  {
    key: "switching",
    label: "Switching",
    min: 0,
    max: 3,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "switchingHeight",
    label: "Switch height",
    min: 0,
    max: 0.2,
    step: 0.005,
    decimals: 3,
  },
  { key: "bloom", label: "Bloom", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "aberration",
    label: "Aberration",
    min: 0,
    max: 12,
    step: 0.5,
    decimals: 1,
  },
  { key: "acBeat", label: "AC beat", min: 0, max: 3, step: 0.05, decimals: 2 },
  { key: "grain", label: "Grain", min: 0, max: 0.5, step: 0.01, decimals: 2 },
  {
    key: "scanlines",
    label: "Scanlines",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "vignette",
    label: "Vignette",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  { key: "barrel", label: "Barrel", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "saturation",
    label: "Saturation",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "exposure",
    label: "Exposure",
    min: 0.5,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
];

export function VHSDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<VHSValues>(DEFAULT_VALUES);
  const setContentEl = useDemoScrollbarGutter();

  const isDefault = valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <VHS
        {...values}
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div
          ref={setContentEl}
          className="min-h-full bg-background px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72"
        >
          {children}
        </div>
      </VHS>

      <DemoControls
        title="VHS controls"
        snippet={{ component: "VHS", props: { ...values } }}
        isDefault={isDefault}
        onReset={() => setValues(DEFAULT_VALUES)}
      >
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
