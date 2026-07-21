"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  publishDemoSnippet,
  type DemoSnippet,
} from "@/components/demos/snippet-store";
import { Scrubber } from "@/components/docs/scrubber";

const EASE = [0.23, 1, 0.32, 1] as const;

const emptySubscribe = () => () => {};

export interface ScrubberDef<K extends string = string> {
  key: K;
  label: string;
  min: number;
  max: number;
  step: number;
  decimals: number;
}

export function valuesAreDefault<T extends Record<string, unknown>>(
  values: T,
  defaults: T,
): boolean {
  return Object.keys(defaults).every((key) => values[key] === defaults[key]);
}

export function useDemoScrollbarGutter() {
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = contentEl;
    if (!el) return;
    const root = document.documentElement;
    const update = () => {
      if (!el.isConnected) return;
      const gutter = Math.max(
        0,
        Math.round(root.clientWidth - el.getBoundingClientRect().width),
      );
      root.style.setProperty("--demo-sbw", `${gutter}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      root.style.removeProperty("--demo-sbw");
    };
  }, [contentEl]);

  return setContentEl;
}

function ScrollFade({ children }: { children: ReactNode }) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = scrollEl;
    if (!el) return;
    const update = () => {
      const top = el.scrollTop > 4;
      const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > 4;
      el.style.setProperty("--fade-top", top ? "1" : "0");
      el.style.setProperty("--fade-bottom", bottom ? "1" : "0");
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollEl]);

  return (
    <div
      ref={setScrollEl}
      className="demo-controls-scroll flex max-h-[min(60vh,480px)] flex-col gap-1.5 overflow-y-auto"
    >
      {children}
    </div>
  );
}

export const DemoControlsTargetContext = createContext<HTMLElement | null>(
  null,
);

export interface DemoControlsProps {
  /** Panel heading, e.g. "Peel controls". */
  title: string;
  /** Disables the Reset button when nothing was changed. */
  isDefault: boolean;
  onReset: () => void;
  /**
   * Portal the widget to document.body. Use for boxed demos inside docs
   * pages, where an animated ancestor transform would otherwise become the
   * containing block for fixed positioning.
   */
  portal?: boolean;
  /**
   * Current component configuration, published to the playground sidebar
   * so its copy actions can emit the component exactly as configured.
   */
  snippet?: DemoSnippet;
  /** Control rows: scrubbers, switches, radios, color pickers. */
  children: ReactNode;
}

export function DemoControls({
  title,
  isDefault,
  onReset,
  portal = false,
  snippet,
  children,
}: DemoControlsProps) {
  const shouldReduceMotion = useReducedMotion();
  const inlineTarget = useContext(DemoControlsTargetContext);
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!snippet) return;
    publishDemoSnippet(snippet);
  }, [snippet]);

  useEffect(() => () => publishDemoSnippet(null), []);

  if (inlineTarget) {
    return createPortal(
      <div className="flex flex-col">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[12px] font-medium text-muted-foreground/70">
            Controls
          </p>
          <button
            type="button"
            onClick={onReset}
            disabled={isDefault}
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <RotateCcw aria-hidden className="size-3" />
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-1.5">{children}</div>
      </div>,
      inlineTarget,
    );
  }

  if (portal && !mounted) return null;

  const widget = (
    <div className="fixed right-[calc(1rem+var(--demo-sbw,0px))] bottom-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ duration: open ? 0.3 : 0.15, ease: EASE }}
            className="w-72 rounded-2xl border border-border/60 bg-background/85 p-3 shadow-xl shadow-black/5 backdrop-blur-xl backdrop-saturate-150"
          >
            <div className="mb-2 flex items-center justify-between pl-1">
              <p className="text-[13px] font-semibold tracking-[-0.01em]">
                {title}
              </p>
              <button
                type="button"
                onClick={onReset}
                disabled={isDefault}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <RotateCcw aria-hidden className="size-3" />
                Reset
              </button>
            </div>
            <ScrollFade>{children}</ScrollFade>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2.5 text-[13px] font-medium backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-muted/70"
      >
        {open ? (
          <X aria-hidden className="size-3.5" />
        ) : (
          <SlidersHorizontal aria-hidden className="size-3.5" />
        )}
        Controls
      </button>
    </div>
  );

  return portal ? createPortal(widget, document.body) : widget;
}

export function ScrubberRows<K extends string>({
  controls,
  values,
  onChange,
}: {
  controls: ScrubberDef<K>[];
  values: Record<K, number>;
  onChange: (key: K, value: number) => void;
}) {
  return (
    <>
      {controls.map((control) => (
        <Scrubber
          key={control.key}
          label={control.label}
          min={control.min}
          max={control.max}
          step={control.step}
          decimals={control.decimals}
          value={values[control.key]}
          onValueChange={(next) => onChange(control.key, next)}
        />
      ))}
    </>
  );
}

export function SwitchRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="flex h-8 w-full shrink-0 cursor-pointer items-center justify-between rounded-lg bg-muted/60 px-3 transition-[background-color,opacity] hover:bg-muted/80"
    >
      <span className="text-[12.5px] font-medium text-foreground/90">
        {label}
      </span>
      <span
        className={`relative h-4.5 w-8 rounded-full transition-colors ${
          checked ? "bg-foreground" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-3.5 rounded-full bg-background transition-transform ${
            checked ? "translate-x-3.5" : ""
          }`}
        />
      </span>
    </button>
  );
}

export function RadioRow<V extends string>({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: readonly { value: V; label: string }[];
  value: V;
  onValueChange: (value: V) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex h-8 w-full shrink-0 items-center gap-1 rounded-lg bg-muted/60 p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onValueChange(option.value)}
          className={`h-6 flex-1 cursor-pointer rounded-md text-[12px] font-medium transition-colors ${
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ColorRow({
  label,
  value,
  onValueChange,
  displayValue,
  onReset,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** Text shown instead of the hex value, e.g. "Auto". */
  displayValue?: string;
  /** When set, shows a Reset link that reverts the row. */
  onReset?: () => void;
}) {
  return (
    <div className="flex h-8 w-full shrink-0 items-center justify-between rounded-lg bg-muted/60 px-3 transition-[background-color,opacity] hover:bg-muted/80">
      <span className="text-[12.5px] font-medium text-foreground/90">
        {label}
      </span>
      <span className="flex items-center gap-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
        )}
        <span
          className="text-[12.5px] font-medium text-muted-foreground"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {displayValue ?? value}
        </span>
        <label className="relative size-4.5 cursor-pointer overflow-hidden rounded-full border border-border/70">
          <input
            type="color"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            aria-label={`${label} color`}
            className="absolute -inset-2 size-9 cursor-pointer border-0 p-0"
          />
        </label>
      </span>
    </div>
  );
}
