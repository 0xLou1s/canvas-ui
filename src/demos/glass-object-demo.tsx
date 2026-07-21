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
import { GlassObject } from "@/lib/GlassObject/GlassObject";
import { DEMO_IMAGES } from "./demo-image-cycler";

type GlassObjectValues = {
  ior: number;
  thickness: number;
  roughness: number;
  dispersion: number;
  clearcoat: number;
  tintDensity: number;
  depth: number;
  bevel: number;
  environmentIntensity: number;
  scale: number;
  xOffset: number;
  yOffset: number;
  floatIntensity: number;
  rotationIntensity: number;
  floatSpeed: number;
  fov: number;
  cameraDistance: number;
};

type GlassObjectToggles = {
  autoRotate: boolean;
  zoom: boolean;
};

const DEFAULT_MODEL = "/logo-icon.svg";
const CLEAR_TINT = "clear";
const DEFAULT_HIGHLIGHT = "#066aff";
const LIGHT_BACKGROUND = "#ffffff";
const DARK_BACKGROUND = "#0a0a0a";

const DEFAULT_VALUES: GlassObjectValues = {
  ior: 1.75,
  thickness: 4,
  roughness: 0.25,
  dispersion: 1.5,
  clearcoat: 0.5,
  tintDensity: 2,
  depth: 0.1,
  bevel: 1,
  environmentIntensity: 1,
  scale: 3,
  xOffset: 0,
  yOffset: 0,
  floatIntensity: 1,
  rotationIntensity: 1,
  floatSpeed: 2,
  fov: 55,
  cameraDistance: 4,
};

const DEFAULT_TOGGLES: GlassObjectToggles = {
  autoRotate: false,
  zoom: false,
};

const CONTROLS: ScrubberDef<keyof GlassObjectValues>[] = [
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
    key: "tintDensity",
    label: "Tint density",
    min: 0.05,
    max: 4,
    step: 0.05,
    decimals: 2,
  },
  {
    key: "depth",
    label: "Depth",
    min: 0.04,
    max: 0.8,
    step: 0.01,
    decimals: 2,
  },
  { key: "bevel", label: "Bevel", min: 0, max: 1, step: 0.05, decimals: 2 },
  {
    key: "environmentIntensity",
    label: "Lighting",
    min: 0,
    max: 3,
    step: 0.05,
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

const TOGGLES: { key: keyof GlassObjectToggles; label: string }[] = [
  { key: "autoRotate", label: "Auto rotate" },
  { key: "zoom", label: "Scroll zoom" },
];

export function GlassObjectDemo() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<GlassObjectValues>(DEFAULT_VALUES);
  const [toggles, setToggles] = useState<GlassObjectToggles>(DEFAULT_TOGGLES);
  const [background, setBackground] = useState<string | null>(null);
  const [tint, setTint] = useState(CLEAR_TINT);
  const [highlight, setHighlight] = useState(DEFAULT_HIGHLIGHT);
  const [src, setSrc] = useState(DEFAULT_MODEL);
  const [urlDraft, setUrlDraft] = useState(DEFAULT_MODEL);
  const [backdrop, setBackdrop] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
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

  useEffect(() => {
    if (!backdrop) return;
    const id = setInterval(
      () => setImageIndex((prev) => (prev + 1) % DEMO_IMAGES.length),
      10000,
    );
    return () => clearInterval(id);
  }, [backdrop]);

  const effectiveBackground =
    background ??
    (resolvedTheme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND);

  const isDefault =
    background === null &&
    backdrop &&
    tint === CLEAR_TINT &&
    highlight === DEFAULT_HIGHLIGHT &&
    src === DEFAULT_MODEL &&
    valuesAreDefault(values, DEFAULT_VALUES) &&
    valuesAreDefault(toggles, DEFAULT_TOGGLES);

  return (
    <>
      <div className="relative h-[420px] overflow-hidden rounded-xl border border-border/60 sm:h-[520px]">
        <GlassObject
          src={src}
          {...values}
          {...toggles}
          tint={tint === CLEAR_TINT ? "" : tint}
          highlight={highlight}
          background={effectiveBackground}
          backgroundImage={backdrop ? DEMO_IMAGES[imageIndex] : ""}
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
        title="Glass Object controls"
        snippet={{
          component: "GlassObject",
          props: {
            src,
            ...values,
            ...toggles,
            tint: tint === CLEAR_TINT ? "" : tint,
            highlight,
            backgroundImage: backdrop ? DEMO_IMAGES[imageIndex] : "",
          },
        }}
        isDefault={isDefault}
        portal
        onReset={() => {
          setValues(DEFAULT_VALUES);
          setToggles(DEFAULT_TOGGLES);
          setBackdrop(true);
          setBackground(null);
          setTint(CLEAR_TINT);
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

        <SwitchRow
          label="Photo backdrop"
          checked={backdrop}
          onCheckedChange={setBackdrop}
        />
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
          value={effectiveBackground}
          onValueChange={setBackground}
          onReset={background !== null ? () => setBackground(null) : undefined}
        />
        <ColorRow
          label="Tint"
          value={tint === CLEAR_TINT ? "#ffffff" : tint}
          onValueChange={setTint}
          displayValue={tint === CLEAR_TINT ? "Clear" : undefined}
          onReset={tint !== CLEAR_TINT ? () => setTint(CLEAR_TINT) : undefined}
        />
        <ColorRow
          label="Highlight"
          value={highlight}
          onValueChange={setHighlight}
          onReset={
            highlight !== DEFAULT_HIGHLIGHT
              ? () => setHighlight(DEFAULT_HIGHLIGHT)
              : undefined
          }
        />
      </DemoControls>
    </>
  );
}
