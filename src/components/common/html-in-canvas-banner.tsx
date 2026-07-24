"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TriangleAlert } from "lucide-react";

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const FLAG_PATH = "flags/#canvas-draw-element";
const CHROME_FLAG = `chrome://${FLAG_PATH}`;

interface ElementImageContext extends CanvasRenderingContext2D {
  drawElementImage?: (element: Element, x: number, y: number) => void;
}

type PaintableCanvas = HTMLCanvasElement & { requestPaint?: () => void };

let cachedSupport: boolean | null = null;

function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  if (cachedSupport !== null) return cachedSupport;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  cachedSupport = Boolean(ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function");
  return cachedSupport;
}

// Never subscribe — support can't change without a browser restart.
const subscribe = () => () => {};
// Assume supported during SSR so the banner stays hidden until the client
// probes, avoiding a flash for the common (flag-off is the exception) case.
const getServerSnapshot = () => true;

type BrowserKind = "chromium" | "unsupported" | "unknown";

interface BrowserInfo {
  /** Display name, or null when we couldn't identify the browser. */
  name: string | null;
  kind: BrowserKind;
  /** Flags URL for this browser (chromium), or the Chrome one as a reference. */
  flag: string;
}

let cachedBrowser: BrowserInfo | null = null;

/**
 * Best-effort browser detection to tailor the enable instructions. HTML-in-Canvas
 * is a Chromium-only experimental API, so Firefox/Safari (and iOS, which is all
 * WebKit) are "unsupported" — there is no flag to flip there.
 */
function detectBrowser(): BrowserInfo {
  if (cachedBrowser) return cachedBrowser;
  if (typeof navigator === "undefined") {
    return { name: null, kind: "unknown", flag: CHROME_FLAG };
  }

  const ua = navigator.userAgent;
  const nav = navigator as Navigator & { brave?: unknown; vendor?: string };
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (nav.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  let info: BrowserInfo;
  if (isIOS) {
    // Every iOS browser is WebKit under the hood — the flag doesn't exist.
    info = { name: "Safari", kind: "unsupported", flag: CHROME_FLAG };
  } else if (typeof nav.brave !== "undefined") {
    info = { name: "Brave", kind: "chromium", flag: `brave://${FLAG_PATH}` };
  } else if (/Edg\//.test(ua)) {
    info = { name: "Edge", kind: "chromium", flag: `edge://${FLAG_PATH}` };
  } else if (/OPR\//.test(ua)) {
    info = { name: "Opera", kind: "chromium", flag: `opera://${FLAG_PATH}` };
  } else if (/Firefox\//.test(ua)) {
    info = { name: "Firefox", kind: "unsupported", flag: CHROME_FLAG };
  } else if (/Chrome\/|Chromium\//.test(ua)) {
    info = { name: "Chrome", kind: "chromium", flag: CHROME_FLAG };
  } else if (/Safari\//.test(ua) && (nav.vendor ?? "").includes("Apple")) {
    info = { name: "Safari", kind: "unsupported", flag: CHROME_FLAG };
  } else {
    info = { name: null, kind: "unknown", flag: CHROME_FLAG };
  }

  cachedBrowser = info;
  return info;
}

/**
 * One-line warning shown directly above a demo whose effect genuinely does not
 * work without Chrome's experimental HTML-in-Canvas flag. Opt in per page via
 * ComponentDoc's `requiresHtmlInCanvas` prop — do not show it for effects that
 * degrade gracefully to a usable fallback.
 */
export function HtmlInCanvasBanner() {
  const supported = useSyncExternalStore(subscribe, supportsHtmlInCanvas, getServerSnapshot);

  if (supported) return null;

  const browser = detectBrowser();
  const unsupported = browser.kind === "unsupported";
  const chromium = browser.kind === "chromium";
  const stepsFlag = browser.flag;
  const relaunch = chromium ? `Relaunch ${browser.name}` : "Relaunch the browser";

  return (
    <Accordion className="not-typeset mt-6 mb-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
      <AccordionItem value="enable">
        <AccordionHeader render={<div />} className="flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <TriangleAlert aria-hidden className="size-4 shrink-0 text-amber-500" />
          <span className="text-[13px] leading-5 text-amber-600 dark:text-amber-400/90">
            {chromium ? (
              <>
                This effect only works with {browser.name}&apos;s <Emph>HTML-in-Canvas</Emph> flag enabled.
              </>
            ) : unsupported ? (
              <>
                This effect needs <Emph>HTML-in-Canvas</Emph>, which {browser.name} doesn&apos;t support.
              </>
            ) : (
              <>
                Your browser doesn&apos;t have <Emph>HTML-in-Canvas</Emph> enabled.
              </>
            )}
          </span>
          <AccordionTrigger className="ml-auto text-[13px] font-medium text-foreground hover:text-foreground/80">{unsupported ? "See how" : "Enable it"}</AccordionTrigger>
        </AccordionHeader>

        <AccordionPanel>
          <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
            {unsupported ? (
              <p className="text-[13px] leading-5 text-muted-foreground">
                HTML-in-Canvas is an experimental Chromium feature that {browser.name} doesn&apos;t support. To see this effect, open this page in Chrome, Brave, or Edge:
              </p>
            ) : null}

            <ol className="space-y-3">
              <li className="flex gap-2.5 text-[13px] leading-6 text-muted-foreground">
                <StepMarker n={1} />
                <span className="min-w-0 flex-1">
                  Copy <CopyFlag flag={stepsFlag} /> and paste it into your browser&apos;s address bar.
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-[13px] leading-5 text-muted-foreground">
                <StepMarker n={2} />
                <span className="min-w-0 flex-1">
                  Set the <Emph>HTML-in-Canvas</Emph> dropdown to <Emph>Enabled</Emph>.
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-[13px] leading-5 text-muted-foreground">
                <StepMarker n={3} />
                <span className="min-w-0 flex-1">{relaunch}, then reload this page.</span>
              </li>
            </ol>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function Emph({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}

function CopyFlag({ flag }: { flag: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onOpenChange = (next: boolean) => {
    if (!next && copiedRef.current) return;
    setOpen(next);
  };

  const copy = () => {
    // Only confirm "Copied" once the write actually succeeds.
    navigator.clipboard
      .writeText(flag)
      .then(() => {
        copiedRef.current = true;
        setCopied(true);
        setOpen(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          copiedRef.current = false;
          setCopied(false);
          setOpen(false);
        }, 1400);
      })
      .catch(() => {});
  };

  return (
    <Tooltip open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger
        onClick={copy}
        aria-label={`Copy ${flag} to clipboard`}
        className="cursor-pointer rounded bg-muted/60 px-1.5 py-0.5 align-middle font-mono text-[12px] text-foreground/90 transition-colors duration-150 hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {flag}
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : "Click to copy"}</TooltipContent>
    </Tooltip>
  );
}

function StepMarker({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-[11px] font-medium text-muted-foreground"
    >
      {n}
    </span>
  );
}
