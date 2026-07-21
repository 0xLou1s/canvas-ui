"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import {
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
import { ParticleObject } from "@/lib/ParticleObject/ParticleObject";

type Values = {
  count: number;
  size: number;
  sizeVariance: number;
  radius: number;
  strength: number;
  swirl: number;
  spring: number;
  damping: number;
  drift: number;
  scale: number;
  floatIntensity: number;
  rotationIntensity: number;
  floatSpeed: number;
  fov: number;
  cameraDistance: number;
};

type Toggles = {
  autoRotate: boolean;
};

const MODEL_URL = "/assets/models/bolt.glb";

const DEFAULT_VALUES: Values = {
  count: 14000,
  size: 2.4,
  sizeVariance: 0.6,
  radius: 110,
  strength: 1,
  swirl: 0.6,
  spring: 1,
  damping: 0.35,
  drift: 0.6,
  scale: 3,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 65,
  cameraDistance: 4.2,
};

const DEFAULT_TOGGLES: Toggles = {
  autoRotate: false,
};

const CONTROLS: ScrubberDef<keyof Values>[] = [
  {
    key: "count",
    label: "Particles",
    min: 1000,
    max: 60000,
    step: 1000,
    decimals: 0,
  },
  { key: "size", label: "Size", min: 0.5, max: 8, step: 0.1, decimals: 1 },
  {
    key: "sizeVariance",
    label: "Variance",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "radius",
    label: "Push radius",
    min: 20,
    max: 320,
    step: 5,
    decimals: 0,
  },
  {
    key: "strength",
    label: "Push strength",
    min: 0,
    max: 4,
    step: 0.1,
    decimals: 1,
  },
  { key: "swirl", label: "Swirl", min: 0, max: 2, step: 0.05, decimals: 2 },
  { key: "spring", label: "Spring", min: 0.1, max: 4, step: 0.05, decimals: 2 },
  { key: "damping", label: "Damping", min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: "drift", label: "Drift", min: 0, max: 3, step: 0.1, decimals: 1 },
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

export function ParticleObjectEntry() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<Values>(DEFAULT_VALUES);
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  const [status, setStatus] = useState<EntryStatus>("loading");

  const isDefault =
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
                <ParticleObject
                  src={MODEL_URL}
                  {...values}
                  {...toggles}
                  scale={values.scale * HERO_BLEED_SCALE}
                  zoom={false}
                  background=""
                  color=""
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
        title="Particle Object controls"
        snippet={{
          component: "ParticleObject",
          props: { src: MODEL_URL, ...values, ...toggles },
        }}
        isDefault={isDefault}
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
        }}
      >
        <SwitchRow
          label="Auto rotate"
          checked={toggles.autoRotate}
          onCheckedChange={(checked) =>
            setToggles((prev) => ({ ...prev, autoRotate: checked }))
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
