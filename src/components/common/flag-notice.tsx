"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "canvasui:flag-notice-dismissed";
const FLAG = "chrome://flags/#canvas-draw-element";
const EASE = [0.23, 1, 0.32, 1] as const;

interface ElementImageContext extends CanvasRenderingContext2D {
  drawElementImage?: (element: Element, x: number, y: number) => void;
}

type PaintableCanvas = HTMLCanvasElement & { requestPaint?: () => void };

function supportsHtmlInCanvas(): boolean {
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  return Boolean(
    ctx &&
    typeof ctx.drawElementImage === "function" &&
    typeof probe.requestPaint === "function",
  );
}

export function FlagNotice() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onDocs =
    pathname.startsWith("/docs") ||
    pathname.startsWith("/components") ||
    pathname.startsWith("/playground");

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOpen(false);
  };

  useEffect(() => {
    if (!onDocs) return;
    let dismissed = false;
    try {
      dismissed = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {}
    if (dismissed || supportsHtmlInCanvas()) return;
    const id = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(id);
  }, [onDocs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(FLAG);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <AnimatePresence>
      {open && onDocs && (
        <motion.div
          role="status"
          aria-label="Browser flag notice"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 10, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 8, scale: 0.98 }
          }
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed top-20 right-[calc(1rem+var(--demo-sbw,0px))] left-4 z-50 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:left-auto sm:w-80 lg:top-28"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute top-2.5 right-2.5 inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground"
          >
            <X aria-hidden className="size-3" />
          </button>
          <p className="pr-5 text-[13px] leading-5 text-muted-foreground">
            You&apos;re seeing the fallback rendering. On Chrome, enable this
            flag and restart to see the full effect:
          </p>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy flag address"}
            className="group mt-3 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-left transition-colors duration-150 hover:bg-muted/70"
          >
            <code className="truncate font-mono text-[12px] text-foreground/90">
              {FLAG}
            </code>
            {copied ? (
              <Check
                aria-hidden
                className="size-3.5 shrink-0 text-foreground"
              />
            ) : (
              <Copy
                aria-hidden
                className="size-3.5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
              />
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
