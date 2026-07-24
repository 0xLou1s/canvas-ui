<script module lang="ts">
  // Experimental html-in-canvas attribute, not yet in svelte/elements.
  declare module "svelte/elements" {
    interface HTMLCanvasAttributes {
      layoutsubtree?: string;
    }
  }
</script>

<script lang="ts">
  import { onMount, tick } from "svelte";

  import {
    createVHS,
    supportsHtmlInCanvas,
    type VHSInstance,
    type VHSOptions,
  } from "./VHSVanilla";

  interface Props extends VHSOptions {
    class?: string;
    children?: import("svelte").Snippet;
  }

  let { class: className = "", children, ...options }: Props = $props();

  let sourceEl = $state<HTMLCanvasElement>()!;
  let contentEl = $state<HTMLDivElement>()!;
  let outputEl = $state<HTMLCanvasElement>()!;
  let native = $state(false);
  let instance: VHSInstance | null = null;

  onMount(() => {
    native = supportsHtmlInCanvas();
    let disposed = false;
    tick().then(() => {
      if (disposed) return;
      instance = createVHS(
        { source: sourceEl, content: contentEl, output: outputEl },
        options,
      );
      if (native && !instance) native = false;
    });
    return () => {
      disposed = true;
      instance?.destroy();
      instance = null;
    };
  });

  $effect(() => {
    instance?.setOptions({ ...options });
  });
</script>

<div class={className} style="position: relative;">
  <canvas
    bind:this={sourceEl}
    layoutsubtree="true"
    style={native
      ? "position: absolute; inset: 0; width: 100%; height: 100%;"
      : "display: none;"}
  >
    {#if native}
      <div
        bind:this={contentEl}
        style="position: relative; width: 100%; height: 100%; overflow: auto;"
      >
        {@render children?.()}
      </div>
    {/if}
  </canvas>
  {#if !native}
    <div
      bind:this={contentEl}
      style="position: relative; width: 100%; height: 100%; overflow: auto;"
    >
      {@render children?.()}
    </div>
  {/if}
  <canvas
    bind:this={outputEl}
    aria-hidden="true"
    style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;"
  ></canvas>
</div>
