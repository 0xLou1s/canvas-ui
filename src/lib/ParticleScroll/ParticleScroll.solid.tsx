/** @jsxImportSource solid-js */

import {
  createEffect,
  createSignal,
  children,
  onCleanup,
  onMount,
  splitProps,
  untrack,
  type JSX,
} from "solid-js";

import {
  createParticleScroll,
  supportsHtmlInCanvas,
  type ParticleScrollInstance,
  type ParticleScrollOptions,
} from "./ParticleScrollVanilla";

declare module "solid-js" {
  namespace JSX {
    interface ExplicitAttributes {
      layoutsubtree: string;
    }
  }
}

export interface ParticleScrollProps extends ParticleScrollOptions {
  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export function ParticleScroll(props: ParticleScrollProps) {
  const [local, options] = splitProps(props, ["children", "class", "style"]);
  const content = children(() => local.children);
  const [mounted, setMounted] = createSignal(false);
  const [supported, setSupported] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const native = () => supported() && !failed();

  let sourceEl!: HTMLCanvasElement;
  let outputEl!: HTMLCanvasElement;
  let instance: ParticleScrollInstance | null = null;
  // A signal rather than a `let`, because this element is destroyed and rebuilt
  // when `native()` flips between the in-canvas and fallback branches. This
  // effect is created before the JSX, so on a flip it runs *first* and a plain
  // `let` would still hold the detached div from the previous branch — the
  // engine would then rasterize a 0x0 orphan and paint nothing. Tracking the
  // ref makes the effect re-run when the new element actually lands.
  const [contentEl, setContentEl] = createSignal<HTMLDivElement>();

  onMount(() => {
    setSupported(supportsHtmlInCanvas());
    setMounted(true);
  });

  createEffect(() => {
    const contentRoot = contentEl();
    if (!mounted() || !contentRoot) return;
    const useNative = native();
    const initialOptions = untrack(() => ({ ...options }));
    const next = createParticleScroll(
      { source: sourceEl, content: contentRoot, output: outputEl },
      initialOptions,
    );
    instance = next;
    if (useNative && !next) setFailed(true);
    onCleanup(() => {
      next?.destroy();
      if (instance === next) instance = null;
    });
  });

  createEffect(() => {
    instance?.setOptions({ ...options });
  });

  return (
    <div class={local.class} style={{ position: "relative", ...local.style }}>
      <canvas
        ref={sourceEl}
        attr:layoutsubtree="true"
        style={
          native()
            ? {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
              }
            : { display: "none" }
        }
      >
        {native() ? (
          <div
            ref={setContentEl}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
            {content()}
          </div>
        ) : null}
      </canvas>
      {!native() ? (
        <div
          ref={setContentEl}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          {content()}
        </div>
      ) : null}
      <canvas
        ref={outputEl}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          "pointer-events": "none",
        }}
      />
    </div>
  );
}

export type { ParticleScrollInstance, ParticleScrollOptions };

export default ParticleScroll;
