"use client";

import { useState } from "react";
import { MousePointer2 } from "lucide-react";

import {
  DemoControls,
  RadioRow,
  ScrubberRows,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { EntryPage } from "@/components/playground/entries/shared";
import { MockDashboard, MockSite } from "@/components/playground/mock-site";
import { Peel } from "@/lib/Peel/Peel";
import type { PeelMode, PeelSide } from "@/lib/Peel/PeelVanilla";

type Values = {
  reveal: number;
  zone: number;
  curl: number;
  bow: number;
  shade: number;
  shine: number;
  shineDistance: number;
  bulge: number;
  perspective: number;
  smoothing: number;
};

const DEFAULT_SIDE: PeelSide = "left";
const DEFAULT_MODE: PeelMode = "hover";

const DEFAULT_VALUES: Values = {
  reveal: 250,
  zone: 200,
  curl: 300,
  bow: 75,
  shade: 0.25,
  shine: 1,
  shineDistance: 1200,
  bulge: 50,
  perspective: 2000,
  smoothing: 0.3,
};

const CONTROLS: ScrubberDef<keyof Values>[] = [
  { key: "reveal", label: "Reveal", min: 80, max: 480, step: 10, decimals: 0 },
  { key: "zone", label: "Zone", min: 40, max: 400, step: 10, decimals: 0 },
  { key: "curl", label: "Curl", min: 40, max: 400, step: 10, decimals: 0 },
  { key: "bow", label: "Bow", min: -150, max: 150, step: 5, decimals: 0 },
  { key: "shade", label: "Shade", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "shine", label: "Shine", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "shineDistance",
    label: "Shine distance",
    min: 0,
    max: 1200,
    step: 50,
    decimals: 0,
  },
  { key: "bulge", label: "Bulge", min: 0, max: 200, step: 10, decimals: 0 },
  {
    key: "perspective",
    label: "Perspective",
    min: 400,
    max: 3000,
    step: 50,
    decimals: 0,
  },
  {
    key: "smoothing",
    label: "Smoothing",
    min: 0.05,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
];

const SIDES: { value: PeelSide; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

const MODES: { value: PeelMode; label: string }[] = [
  { value: "hover", label: "Hover" },
  { value: "cursor", label: "Cursor" },
];

function Layer({
  badge,
  variant,
}: {
  badge: string;
  variant: "modern" | "legacy";
}) {
  return (
    <div className="relative h-full w-full">
      <MockDashboard variant={variant} />
      <span
        className={`absolute right-4 bottom-4 rounded-full px-3 py-1.5 text-[12px] font-medium ${
          variant === "modern"
            ? "bg-foreground text-background"
            : "bg-[#3a382f] font-mono text-[#ece9e2]"
        }`}
      >
        {badge}
      </span>
    </div>
  );
}

export function PeelEntry() {
  const [values, setValues] = useState<Values>(DEFAULT_VALUES);
  const [side, setSide] = useState<PeelSide>(DEFAULT_SIDE);
  const [mode, setMode] = useState<PeelMode>(DEFAULT_MODE);
  const [peeked, setPeeked] = useState(false);

  const isDefault =
    side === DEFAULT_SIDE &&
    mode === DEFAULT_MODE &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <EntryPage>
        <MockSite
          heroMedia={
            <div
              className="absolute inset-0 touch-none"
              onPointerEnter={() => setPeeked(true)}
            >
              <Peel
                {...values}
                side={side}
                mode={mode}
                shineColor="auto"
                className="inset-0"
                style={{ position: "absolute" }}
                under={<Layer badge="bolt in 2019" variant="legacy" />}
              >
                <Layer badge="bolt today" variant="modern" />
              </Peel>
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-500 ${
                  peeked ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="flex animate-bounce items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-[13px] font-medium text-white shadow-lg backdrop-blur-sm">
                  <MousePointer2 aria-hidden className="size-3.5" />
                  {mode === "hover"
                    ? "Hover the dashboard to peel back the redesign"
                    : "Move your cursor across to peel back the redesign"}
                </span>
              </div>
            </div>
          }
        />
      </EntryPage>

      <DemoControls
        title="Peel controls"
        snippet={{
          component: "Peel",
          props: { ...values, side, mode, shineColor: "auto" },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setSide(DEFAULT_SIDE);
          setMode(DEFAULT_MODE);
        }}
      >
        <RadioRow
          label="Mode"
          options={MODES}
          value={mode}
          onValueChange={(next) => {
            setMode(next);
            setPeeked(false);
          }}
        />
        <RadioRow
          label="Side"
          options={SIDES}
          value={side}
          onValueChange={setSide}
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
