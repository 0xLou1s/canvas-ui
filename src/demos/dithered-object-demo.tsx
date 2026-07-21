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
import { DitheredObject } from "@/lib/DitheredObject/DitheredObject";

type DitheredObjectValues = {
  gridSize: number;
  pixelSizeRatio: number;
  environmentIntensity: number;
  roughness: number;
  scale: number;
  xOffset: number;
  yOffset: number;
  floatIntensity: number;
  rotationIntensity: number;
  floatSpeed: number;
  fov: number;
  cameraDistance: number;
};

type DitheredObjectToggles = {
  grayscale: boolean;
  invert: boolean;
  dither: boolean;
  autoRotate: boolean;
  zoom: boolean;
};

const DEFAULT_MODEL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb";
const DEFAULT_HIGHLIGHT = "#066aff";
const LIGHT_BACKGROUND = "#ffffff";
const DARK_BACKGROUND = "#0a0a0a";

const DEFAULT_VALUES: DitheredObjectValues = {
  gridSize: 4,
  pixelSizeRatio: 1,
  environmentIntensity: 0.1,
  roughness: 0.15,
  scale: 3,
  xOffset: 0,
  yOffset: 0,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 65,
  cameraDistance: 4.2,
};

const DEFAULT_TOGGLES: DitheredObjectToggles = {
  grayscale: true,
  invert: false,
  dither: true,
  autoRotate: false,
  zoom: false,
};

const CONTROLS: ScrubberDef<keyof DitheredObjectValues>[] = [
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

const TOGGLES: { key: keyof DitheredObjectToggles; label: string }[] = [
  { key: "dither", label: "Dither" },
  { key: "grayscale", label: "Grayscale" },
  { key: "invert", label: "Invert" },
  { key: "autoRotate", label: "Auto rotate" },
  { key: "zoom", label: "Scroll zoom" },
];

export function DitheredObjectDemo() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<DitheredObjectValues>(DEFAULT_VALUES);
  const [toggles, setToggles] =
    useState<DitheredObjectToggles>(DEFAULT_TOGGLES);
  const [background, setBackground] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(DEFAULT_HIGHLIGHT);
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
    highlight === DEFAULT_HIGHLIGHT &&
    src === DEFAULT_MODEL &&
    valuesAreDefault(values, DEFAULT_VALUES) &&
    valuesAreDefault(toggles, DEFAULT_TOGGLES);

  return (
    <>
      <div className="relative h-[420px] overflow-hidden rounded-xl border border-border/60 sm:h-[520px]">
        <DitheredObject
          src={src}
          {...values}
          {...toggles}
          background={background ?? ""}
          highlight={highlight}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className="h-full w-full"
        />
        {status !== "ready" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
              {status === "loading"
                ? "Loading model…"
                : "Could not load that model. Check the URL or try another file."}
            </span>
          </div>
        ) : null}
      </div>

      <DemoControls
        title="Dithered Object controls"
        snippet={{
          component: "DitheredObject",
          props: { src, ...values, ...toggles, highlight },
        }}
        isDefault={isDefault}
        portal
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
          setBackground(null);
          setHighlight(DEFAULT_HIGHLIGHT);
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
            placeholder="Model URL (.glb / .gltf)"
            aria-label="Model URL"
            spellCheck={false}
            className="h-8 w-full min-w-0 rounded-lg bg-muted/60 px-3 text-[12.5px] font-medium text-foreground/90 outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/80 focus:bg-muted/80"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Open a model file"
            title="Open a model file"
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <FileUp aria-hidden className="size-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
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
          label="Highlight"
          value={highlight}
          onValueChange={setHighlight}
        />
      </DemoControls>
    </>
  );
}
