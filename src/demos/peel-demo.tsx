"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  FolderKanban,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

import {
  ColorRow,
  DemoControls,
  RadioRow,
  ScrubberRows,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { Peel } from "@/lib/Peel/Peel";
import type { PeelMode, PeelSide } from "@/lib/Peel/PeelVanilla";

type PeelValues = {
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
const DEFAULT_MODE: PeelMode = "cursor";
const AUTO_COLOR = "auto";

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const DEFAULT_VALUES: PeelValues = {
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

const CONTROLS: ScrubberDef<keyof PeelValues>[] = [
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
  { value: "cursor", label: "Cursor" },
  { value: "hover", label: "Hover" },
];

const STATS = [
  { label: "Revenue", value: "$48.2k", change: "+12.4%", up: true },
  { label: "Active users", value: "8,431", change: "+3.2%", up: true },
  { label: "Conversion", value: "4.6%", change: "-0.8%", up: false },
];

const BARS = [42, 68, 54, 80, 63, 92, 75, 58, 86, 70, 96, 82];

const ROWS = [
  { name: "Q3 landing refresh", status: "In review", time: "2h ago" },
  { name: "Checkout experiment", status: "Shipped", time: "5h ago" },
  { name: "Mobile onboarding", status: "In progress", time: "1d ago" },
];

function DashboardScene() {
  return (
    <div className="flex h-full w-full flex-col bg-background px-5 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em]">
            Overview
          </p>
          <p className="text-[12px] text-muted-foreground">Last 30 days</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
          {["Overview", "Reports", "Settings"].map((tab, index) => (
            <span
              key={tab}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
                index === 0
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/60 bg-card px-3.5 py-3"
          >
            <p className="truncate text-[12px] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.01em]">
              {stat.value}
            </p>
            <p
              className={`mt-0.5 flex items-center gap-0.5 text-[11.5px] font-medium ${
                stat.up ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {stat.up ? (
                <ArrowUpRight aria-hidden className="size-3" />
              ) : (
                <ArrowDownRight aria-hidden className="size-3" />
              )}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex-1 rounded-xl border border-border/60 bg-card px-3.5 py-3">
        <p className="text-[12px] font-medium text-muted-foreground">
          Weekly sessions
        </p>
        <div className="mt-2 flex h-[calc(100%-2rem)] min-h-16 items-end gap-1.5">
          {BARS.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-foreground/75"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border/60 bg-card px-3.5 py-2">
        {ROWS.map((row, index) => (
          <div
            key={row.name}
            className={`flex items-center justify-between py-2 ${
              index > 0 ? "border-t border-border/50" : ""
            }`}
          >
            <p className="truncate text-[12.5px] font-medium">{row.name}</p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                {row.status}
              </span>
              <span className="hidden text-[11.5px] text-muted-foreground sm:block">
                {row.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Projects", icon: FolderKanban, active: false },
  { label: "Team", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
];

function UnderPanel({ side }: { side: PeelSide }) {
  const horizontal = side === "top" || side === "bottom";

  const nav = (
    <nav
      className={
        horizontal ? "flex items-center gap-1.5" : "flex flex-col gap-1"
      }
    >
      {NAV.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
            item.active
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          }`}
        >
          <item.icon aria-hidden className="size-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  if (horizontal) {
    return (
      <div
        className={`flex h-full w-full bg-muted ${
          side === "top" ? "items-start" : "items-end"
        }`}
      >
        <div className="flex w-full items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[12px] font-bold text-background">
              A
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">
              Acme
            </span>
          </div>
          {nav}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full bg-muted ${
        side === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex h-full w-66 flex-col px-4 py-5">
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[12px] font-bold text-background">
            A
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.01em]">
            Acme
          </span>
        </div>
        <div className="mt-5 flex-1">{nav}</div>
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-foreground/15 text-[11px] font-semibold">
            AD
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12.5px] font-medium">Ada Lovelace</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Pro plan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PeelDemo() {
  const [values, setValues] = useState<PeelValues>(DEFAULT_VALUES);
  const [side, setSide] = useState<PeelSide>(DEFAULT_SIDE);
  const [mode, setMode] = useState<PeelMode>(DEFAULT_MODE);
  const [shineColor, setShineColor] = useState(AUTO_COLOR);

  const isDefault =
    side === DEFAULT_SIDE &&
    mode === DEFAULT_MODE &&
    shineColor === AUTO_COLOR &&
    valuesAreDefault(values, DEFAULT_VALUES);

  return (
    <section className="mt-8" aria-label="Demo">
      <div className="relative h-130 touch-none overflow-hidden rounded-xl border border-border/60 bg-background">
        <Peel
          {...values}
          side={side}
          mode={mode}
          shineColor={shineColor === AUTO_COLOR ? "auto" : hexToRgb(shineColor)}
          className="inset-0"
          style={{ position: "absolute" }}
          under={<UnderPanel side={side} />}
        >
          <DashboardScene />
        </Peel>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Move your cursor to the {side} edge to peel the dashboard.
      </p>

      <DemoControls
        title="Peel controls"
        snippet={{
          component: "Peel",
          props: {
            ...values,
            side,
            mode,
            shineColor:
              shineColor === AUTO_COLOR ? "auto" : hexToRgb(shineColor),
          },
        }}
        isDefault={isDefault}
        portal
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setSide(DEFAULT_SIDE);
          setMode(DEFAULT_MODE);
          setShineColor(AUTO_COLOR);
        }}
      >
        <RadioRow
          label="Peel side"
          options={SIDES}
          value={side}
          onValueChange={setSide}
        />
        <RadioRow
          label="Peel mode"
          options={MODES}
          value={mode}
          onValueChange={setMode}
        />
        <ColorRow
          label="Shine color"
          value={shineColor === AUTO_COLOR ? "#ffffff" : shineColor}
          onValueChange={setShineColor}
          displayValue={shineColor === AUTO_COLOR ? "Auto" : undefined}
          onReset={
            shineColor !== AUTO_COLOR
              ? () => setShineColor(AUTO_COLOR)
              : undefined
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
    </section>
  );
}
