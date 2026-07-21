"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  ColorRow,
  DemoControls,
  RadioRow,
  ScrubberRows,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Cloth } from "@/lib/Cloth/Cloth";
import type { ClothPin } from "@/lib/Cloth/ClothVanilla";

type ClothValues = {
  wind: number;
  speed: number;
  amplitude: number;
  drape: number;
  brush: number;
  brushSize: number;
  damping: number;
  light: number;
  sheen: number;
  shadow: number;
  cornerRadius: number;
  perspective: number;
};

const DEFAULT_PIN: ClothPin = "top";
const AUTO_COLOR = "auto";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const DEFAULT_VALUES: ClothValues = {
  wind: 3,
  speed: 0.5,
  amplitude: 30,
  drape: 40,
  brush: 2.05,
  brushSize: 150,
  damping: 1,
  light: 0.5,
  sheen: 0.1,
  shadow: 0.25,
  cornerRadius: 20,
  perspective: 1200,
};

const CONTROLS: ScrubberDef<keyof ClothValues>[] = [
  { key: "wind", label: "Wind", min: 0, max: 5, step: 0.05, decimals: 2 },
  { key: "speed", label: "Speed", min: 0, max: 3, step: 0.05, decimals: 2 },
  {
    key: "amplitude",
    label: "Fold height",
    min: 0,
    max: 60,
    step: 1,
    decimals: 0,
  },
  { key: "drape", label: "Billow", min: 0, max: 50, step: 1, decimals: 0 },
  { key: "brush", label: "Brush", min: 0, max: 3, step: 0.05, decimals: 2 },
  {
    key: "brushSize",
    label: "Brush size",
    min: 30,
    max: 260,
    step: 5,
    decimals: 0,
  },
  {
    key: "damping",
    label: "Settle",
    min: 0.2,
    max: 4,
    step: 0.05,
    decimals: 2,
  },
  { key: "light", label: "Lighting", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "sheen", label: "Sheen", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "shadow", label: "Shadow", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "cornerRadius",
    label: "Corners",
    min: 0,
    max: 160,
    step: 2,
    decimals: 0,
  },
  {
    key: "perspective",
    label: "Perspective",
    min: 400,
    max: 4000,
    step: 50,
    decimals: 0,
  },
];

const PINS: { value: ClothPin; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

function usePageScrollSync(inner: HTMLElement | null) {
  const [overflowPx, setOverflowPx] = useState(0);

  useEffect(() => {
    if (!inner) return;
    const scroller = inner.parentElement;
    if (!scroller) return;
    const sync = () => {
      scroller.scrollTop = window.scrollY;
    };
    const measure = () => {
      setOverflowPx(Math.max(0, scroller.scrollHeight - scroller.clientHeight));
      sync();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    observer.observe(scroller);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", measure);
    };
  }, [inner]);

  return overflowPx;
}

export function ClothDemo({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<ClothValues>(DEFAULT_VALUES);
  const [pin, setPin] = useState<ClothPin>(DEFAULT_PIN);
  const [backing, setBacking] = useState(AUTO_COLOR);
  const [inner, setInner] = useState<HTMLDivElement | null>(null);
  const overflowPx = usePageScrollSync(inner);

  const isDefault =
    pin === DEFAULT_PIN &&
    backing === AUTO_COLOR &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <>
      <div
        aria-hidden
        style={{ height: `calc(100vh - 5rem + ${overflowPx}px)` }}
      />
      <div className="page-enter pointer-events-none fixed inset-0 z-30 px-5 pt-24 pb-10 sm:px-8 lg:pt-16 lg:pr-8 lg:pl-72">
        <Cloth
          {...values}
          pin={pin}
          backing={backing === AUTO_COLOR ? "auto" : hexToRgb(backing)}
          className="pointer-events-auto mx-auto h-full w-full max-w-[52rem]"
        >
          <div
            ref={setInner}
            className="min-h-full bg-background px-8 pt-10 pb-12"
          >
            {children}
          </div>
        </Cloth>
      </div>

      <DemoControls
        title="Cloth controls"
        snippet={{
          component: "Cloth",
          props: {
            ...values,
            pin,
            backing: backing === AUTO_COLOR ? "auto" : hexToRgb(backing),
          },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setPin(DEFAULT_PIN);
          setBacking(AUTO_COLOR);
        }}
      >
        <RadioRow
          label="Pinned edge"
          options={PINS}
          value={pin}
          onValueChange={setPin}
        />
        <ColorRow
          label="Backing"
          value={backing === AUTO_COLOR ? "#ffffff" : backing}
          onValueChange={setBacking}
          displayValue={backing === AUTO_COLOR ? "Auto" : undefined}
          onReset={
            backing !== AUTO_COLOR ? () => setBacking(AUTO_COLOR) : undefined
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
