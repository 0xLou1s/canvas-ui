"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders the marquee track with a seamless-loop duplicate of its children.
 * The duplicate is added only after hydration so it is not serialized into
 * the prerendered HTML or the RSC flight payload (it is pure decoration).
 */
export function MarqueeTrack({
  children,
  direction,
  duration,
}: {
  children: ReactNode;
  direction?: "reverse";
  duration: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <div
      className="marquee-track"
      data-direction={direction}
      data-ready={ready || undefined}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      <ul className="flex gap-4 pr-4">{children}</ul>
      {ready && (
        <ul aria-hidden inert className="flex gap-4 pr-4">
          {children}
        </ul>
      )}
    </div>
  );
}
