"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import {
  ColorRow,
  DemoControls,
  ScrubberRows,
  SwitchRow,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import {
  EntryPage,
  HERO_BLEED_CLASS,
  HERO_BLEED_SCALE,
  StatusPill,
  type EntryStatus,
} from "@/components/playground/entries/shared";
import { MockSite } from "@/components/playground/mock-site";
import { DitheredObject } from "@/lib/DitheredObject/DitheredObject";

type Values = {
  gridSize: number;
  pixelSizeRatio: number;
  environmentIntensity: number;
  roughness: number;
  scale: number;
  floatIntensity: number;
  rotationIntensity: number;
  floatSpeed: number;
  fov: number;
  cameraDistance: number;
};

type Toggles = {
  grayscale: boolean;
  invert: boolean;
  dither: boolean;
  autoRotate: boolean;
};

const MODEL_URL = "/assets/models/bolt.glb";
const DEFAULT_HIGHLIGHT = "#066aff";

const DEFAULT_VALUES: Values = {
  gridSize: 4,
  pixelSizeRatio: 1,
  environmentIntensity: 0.1,
  roughness: 0.15,
  scale: 3,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 65,
  cameraDistance: 4.2,
};

const DEFAULT_TOGGLES: Toggles = {
  grayscale: true,
  invert: false,
  dither: true,
  autoRotate: false,
};

const CONTROLS: ScrubberDef<keyof Values>[] = [
  {
    key: "gridSize",
    label: "Grid size",
    min: 1,
    max: 20,
    step: 1,
    decimals: 0,
  },
  {
    key: "pixelSizeRatio",
    label: "Pixelation",
    min: 1,
    max: 10,
    step: 1,
    decimals: 0,
  },
  {
    key: "environmentIntensity",
    label: "Environment",
    min: 0,
    max: 5,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "roughness",
    label: "Roughness",
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
  },
  { key: "scale", label: "Scale", min: 0.5, max: 6, step: 0.1, decimals: 1 },
  {
    key: "floatIntensity",
    label: "Float",
    min: 0,
    max: 6,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "rotationIntensity",
    label: "Rocking",
    min: 0,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "floatSpeed",
    label: "Float speed",
    min: 0,
    max: 8,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "fov",
    label: "Field of view",
    min: 20,
    max: 100,
    step: 1,
    decimals: 0,
  },
  {
    key: "cameraDistance",
    label: "Camera distance",
    min: 2,
    max: 10,
    step: 0.1,
    decimals: 1,
  },
];

const TOGGLES: { key: keyof Toggles; label: string }[] = [
  { key: "dither", label: "Dither" },
  { key: "grayscale", label: "Grayscale" },
  { key: "invert", label: "Invert" },
  { key: "autoRotate", label: "Auto rotate" },
];

export function DitheredObjectEntry() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<Values>(DEFAULT_VALUES);
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  const [highlight, setHighlight] = useState(DEFAULT_HIGHLIGHT);
  const [status, setStatus] = useState<EntryStatus>("loading");

  const isDefault =
    highlight === DEFAULT_HIGHLIGHT &&
    valuesAreDefault(values, DEFAULT_VALUES) &&
    valuesAreDefault(toggles, DEFAULT_TOGGLES);

  return (
    <>
      <EntryPage>
        <MockSite
          heroBleed
          heroMedia={
            <>
              <div
                className={`absolute inset-0 rounded-2xl ${
                  resolvedTheme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
                }`}
              />
              <div className={HERO_BLEED_CLASS}>
                <DitheredObject
                  src={MODEL_URL}
                  {...values}
                  {...toggles}
                  scale={values.scale * HERO_BLEED_SCALE}
                  zoom={false}
                  background=""
                  highlight={highlight}
                  onLoad={() => setStatus("ready")}
                  onError={() => setStatus("error")}
                  className="h-full w-full"
                />
              </div>
              <StatusPill status={status} />
            </>
          }
        />
      </EntryPage>

      <DemoControls
        title="Dithered Object controls"
        snippet={{
          component: "DitheredObject",
          props: { src: MODEL_URL, ...values, ...toggles, highlight },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
          setHighlight(DEFAULT_HIGHLIGHT);
        }}
      >
        {TOGGLES.map((toggle) => (
          <SwitchRow
            key={toggle.key}
            label={toggle.label}
            checked={toggles[toggle.key]}
            onCheckedChange={(checked) =>
              setToggles((prev) => ({ ...prev, [toggle.key]: checked }))
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
        <ColorRow
          label="Highlight"
          value={highlight}
          onValueChange={setHighlight}
        />
      </DemoControls>
    </>
  );
}
