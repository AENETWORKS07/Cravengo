"use client";

import { useEffect, useRef, useState } from "react";
import { formatPoints } from "@/lib/loyalty";

/** Counts from the previous value to the new one so a top-up is felt, not just read. */
export function PointsTicker({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    const delta = value - start;
    if (delta === 0) return;
    const t0 = performance.now();
    const dur = Math.min(1400, 500 + Math.abs(delta) * 0.6);
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + delta * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{formatPoints(shown)}</span>;
}
