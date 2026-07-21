"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "canvasui:flag-notice-dismissed";
const FLAG = "chrome://flags/#canvas-draw-element";
const EASE = [0.23, 1, 0.32, 1] as const;

export function FlagNotice() {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOpen(false);
  };

  useEffect(() => {
    let show = false;
    try {
      show = !localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (!show) return;
    const id = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(id);
  }, []);

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
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/40 px-5 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="flag-notice-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-background p-6 shadow-2xl shadow-black/10"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground"
            >
              <X aria-hidden className="size-3.5" />
            </button>
            <h2
              id="flag-notice-title"
              className="text-[15px] font-semibold tracking-[-0.01em]"
            >
              Heads up
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Some components use an experimental browser API. To see them in
              action, enable this flag in Chrome and restart:
            </p>

            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy flag address"}
              className="group mt-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-muted/70"
            >
              <code className="truncate font-mono text-[12.5px] text-foreground/90">
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

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-foreground text-[13px] font-medium text-background transition-opacity duration-150 hover:opacity-90"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
