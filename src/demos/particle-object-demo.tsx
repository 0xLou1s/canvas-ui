"use client";

import { FileUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import {
  ColorRow,
  DemoControls,
  ScrubberRows,
  SwitchRow,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/demos/demo-controls";
import { ParticleObject } from "@/lib/ParticleObject/ParticleObject";

type ParticleObjectValues = {
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
  xOffset: number;
  yOffset: number;
  floatIntensity: number;
  rotationIntensity: number;
  floatSpeed: number;
  fov: number;
  cameraDistance: number;
};

type ParticleObjectToggles = {
  autoRotate: boolean;
  zoom: boolean;
};

const DEFAULT_MODEL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb";
const AUTO_COLOR = "auto";
const LIGHT_BACKGROUND = "#ffffff";
const DARK_BACKGROUND = "#0a0a0a";

const DEFAULT_VALUES: ParticleObjectValues = {
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
  xOffset: 0,
  yOffset: 0,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 65,
  cameraDistance: 4.2,
};

const DEFAULT_TOGGLES: ParticleObjectToggles = {
  autoRotate: false,
  zoom: false,
};

const CONTROLS: ScrubberDef<keyof ParticleObjectValues>[] = [
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
    key: "xOffset",
    label: "X offset",
    min: -3,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
  {
    key: "yOffset",
    label: "Y offset",
    min: -3,
    max: 3,
    step: 0.1,
    decimals: 1,
  },
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

const TOGGLES: { key: keyof ParticleObjectToggles; label: string }[] = [
  { key: "autoRotate", label: "Auto rotate" },
  { key: "zoom", label: "Scroll zoom" },
];

export function ParticleObjectDemo() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<ParticleObjectValues>(DEFAULT_VALUES);
  const [toggles, setToggles] =
    useState<ParticleObjectToggles>(DEFAULT_TOGGLES);
  const [background, setBackground] = useState<string | null>(null);
  const [tint, setTint] = useState(AUTO_COLOR);
  const [src, setSrc] = useState(DEFAULT_MODEL);
  const [urlDraft, setUrlDraft] = useState(DEFAULT_MODEL);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const applySrc = (next: string) => {
    if (!next || next === src) return;
    setStatus("loading");
    setSrc(next);
  };

  const applyUrl = () => {
    const next = urlDraft.trim();
    if (objectUrlRef.current && next !== objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    applySrc(next);
  };

  const applyFile = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setUrlDraft(file.name);
    applySrc(url);
  };

  const swatchBackground =
    background ??
    (resolvedTheme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND);

  const isDefault =
    background === null &&
    tint === AUTO_COLOR &&
    src === DEFAULT_MODEL &&
    valuesAreDefault(values, DEFAULT_VALUES) &&
    valuesAreDefault(toggles, DEFAULT_TOGGLES);

  return (
    <>
      <div className="relative h-[420px] overflow-hidden rounded-xl border border-border/60 sm:h-[520px]">
        <ParticleObject
          src={src}
          {...values}
          {...toggles}
          background={background ?? ""}
          color={tint === AUTO_COLOR ? "" : tint}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className="h-full w-full"
        />
        {status !== "ready" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
              {status === "loading"
                ? "Loading asset…"
                : "Could not load that asset. Check the URL or try another file."}
            </span>
          </div>
        ) : null}
      </div>

      <DemoControls
        title="Particle Object controls"
        snippet={{
          component: "ParticleObject",
          props: {
            src,
            ...values,
            ...toggles,
            color: tint === AUTO_COLOR ? "" : tint,
          },
        }}
        isDefault={isDefault}
        portal
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
          setBackground(null);
          setTint(AUTO_COLOR);
          setUrlDraft(DEFAULT_MODEL);
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
          }
          applySrc(DEFAULT_MODEL);
        }}
      >
        <div className="flex w-full shrink-0 items-center gap-1.5">
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyUrl();
            }}
            onBlur={applyUrl}
            placeholder="Asset URL (.glb / .gltf / .svg / .png)"
            aria-label="Asset URL"
            spellCheck={false}
            className="h-8 w-full min-w-0 rounded-lg bg-muted/60 px-3 text-[12.5px] font-medium text-foreground/90 outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/80 focus:bg-muted/80"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Open an asset file"
            title="Open an asset file"
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <FileUp aria-hidden className="size-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,.svg,.png,.jpg,.jpeg,.webp,.gif,model/gltf-binary,model/gltf+json,image/svg+xml,image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) applyFile(file);
              e.target.value = "";
            }}
          />
        </div>

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
          label="Background"
          value={swatchBackground}
          onValueChange={setBackground}
        />
        <ColorRow
          label="Tint"
          value={tint === AUTO_COLOR ? "#ffffff" : tint}
          onValueChange={setTint}
          displayValue={tint === AUTO_COLOR ? "Auto" : undefined}
          onReset={tint !== AUTO_COLOR ? () => setTint(AUTO_COLOR) : undefined}
        />
      </DemoControls>
    </>
  );
}
