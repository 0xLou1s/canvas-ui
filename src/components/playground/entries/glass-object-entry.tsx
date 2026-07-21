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
  StatusPill,
  type EntryStatus,
} from "@/components/playground/entries/shared";
import { MOCK_IMAGES, MockSite } from "@/components/playground/mock-site";
import { GlassObject } from "@/lib/GlassObject/GlassObject";

type Values = {
  ior: number;
  thickness: number;
  roughness: number;
  dispersion: number;
  clearcoat: number;
  depth: number;
  bevel: number;
  environmentIntensity: number;
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

const DEFAULT_VALUES: Values = {
  ior: 1.75,
  thickness: 4,
  roughness: 0.25,
  dispersion: 1.5,
  clearcoat: 0.5,
  depth: 0.1,
  bevel: 1,
  environmentIntensity: 1,
  scale: 3,
  floatIntensity: 1,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 55,
  cameraDistance: 4,
};

const DEFAULT_TOGGLES: Toggles = {
  autoRotate: false,
};

const CONTROLS: ScrubberDef<keyof Values>[] = [
  {
    key: "ior",
    label: "Refraction",
    min: 1,
    max: 2.33,
    step: 0.01,
    decimals: 2,
  },
  {
    key: "thickness",
    label: "Thickness",
    min: 0,
    max: 4,
    step: 0.05,
    decimals: 2,
  },
  { key: "roughness", label: "Frost", min: 0, max: 1, step: 0.01, decimals: 2 },
  {
    key: "dispersion",
    label: "Dispersion",
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "clearcoat",
    label: "Clearcoat",
    min: 0,
    max: 1,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "depth",
    label: "Depth",
    min: 0.04,
    max: 0.8,
    step: 0.02,
    decimals: 2,
  },
  { key: "bevel", label: "Bevel", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "environmentIntensity",
    label: "Environment",
    min: 0,
    max: 4,
    step: 0.1,
    decimals: 1,
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

export function GlassObjectEntry() {
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
          heroMedia={
            <div className="absolute inset-0">
              <GlassObject
                src="/assets/bolt-mark.svg"
                {...values}
                {...toggles}
                zoom={false}
                tint=""
                background={resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff"}
                backgroundImage={MOCK_IMAGES.glassBackdrop}
                onLoad={() => setStatus("ready")}
                onError={() => setStatus("error")}
                className="h-full w-full"
              />
              <StatusPill status={status} />
            </div>
          }
        />
      </EntryPage>

      <DemoControls
        title="Glass Object controls"
        snippet={{
          component: "GlassObject",
          props: {
            src: "/assets/bolt-mark.svg",
            ...values,
            ...toggles,
            background: resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff",
            backgroundImage: MOCK_IMAGES.glassBackdrop,
          },
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
