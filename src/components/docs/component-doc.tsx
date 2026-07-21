import type { ReactNode } from "react";

import { ApiReference, type ApiProp } from "@/components/docs/api-reference";
import { CodeTabs, type CodeVariant } from "@/components/docs/code-tabs";
import { CopyMenu } from "@/components/docs/copy-menu";
import { DependencyTabs } from "@/components/docs/dependency-tabs";
import { InstallTabs } from "@/components/docs/install-tabs";
import { getComponentDependencies, getDemoSource } from "@/lib/registry";

export interface ComponentDocProps {
  title: string;
  description: string;
  /** Optional boxed demo. Omit when the whole page is the demo. */
  preview?: ReactNode;
  /** Optional extra content rendered before the Install section. */
  beforeInstall?: ReactNode;
  /** One entry per framework, pre-highlighted on the server. */
  variants: CodeVariant[];
  /** Registry item base name, e.g. "liquid" for /r/liquid-react.json. */
  installItem: string;
  /** Small tag chips shown under the description, e.g. ["html-in-canvas"]. */
  tags?: string[];
  /** Props table shown in the API reference section. */
  apiReference?: ApiProp[];
}

export function ComponentDoc({
  title,
  description,
  preview,
  beforeInstall,
  variants,
  installItem,
  tags,
  apiReference,
}: ComponentDocProps) {
  const { dependencies, devDependencies } =
    getComponentDependencies(installItem);
  const demoSource = getDemoSource(installItem);

  return (
    <article className="mx-auto w-full max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">{title}</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
          {tags && tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/60 px-2.5 py-0.5 text-[11.5px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <CopyMenu
          title={title}
          description={description}
          installItem={installItem}
          variants={variants}
          apiReference={apiReference}
          dependencies={dependencies}
          devDependencies={devDependencies}
          demoSource={demoSource}
        />
      </div>

      {preview ? (
        <section className="mt-8" aria-label="Preview">
          <div className="relative h-105 touch-none overflow-hidden rounded-xl border border-border/60 bg-background">
            {preview}
          </div>
        </section>
      ) : null}

      {beforeInstall}

      <section className="mt-8" aria-label="Installation">
        <h2 className="text-lg font-semibold tracking-[-0.01em]">Install</h2>
        <div className="mt-3">
          <InstallTabs item={installItem} />
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Or copy the source below into your project.
        </p>
      </section>

      {dependencies.length > 0 || devDependencies.length > 0 ? (
        <section className="mt-8" aria-label="Dependencies">
          <h2 className="text-lg font-semibold tracking-[-0.01em]">
            Dependencies
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            The install command above adds these automatically. If you copy the
            source by hand, install them yourself.
          </p>
          <div className="mt-3">
            <DependencyTabs
              dependencies={dependencies}
              devDependencies={devDependencies}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-8" aria-label="Code">
        <h2 className="text-lg font-semibold tracking-[-0.01em]">Code</h2>
        <div className="mt-3">
          <CodeTabs variants={variants} />
        </div>
      </section>

      {apiReference && apiReference.length > 0 ? (
        <section className="mt-8" aria-label="API reference">
          <h2 className="text-lg font-semibold tracking-[-0.01em]">
            API reference
          </h2>
          <div className="mt-3">
            <ApiReference props={apiReference} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
