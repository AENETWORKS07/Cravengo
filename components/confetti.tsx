"use client";

import { useEffect, useMemo, useState } from "react";

const COLOURS = ["#ff3d81", "#7b2cbf", "#9be15d", "#ffc857", "#00c9a7", "#ffffff"];

/** Small seeded generator so each burst is different but render stays pure. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Confetti({ burst }: { burst: number }) {
  const [cleared, setCleared] = useState(0);
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setCleared(burst), 2600);
    return () => clearTimeout(t);
  }, [burst]);

  const pieces = useMemo(() => {
    const r = rng(burst * 7919 + 17);
    return Array.from({ length: 70 }, (_, i) => ({
      left: r() * 100,
      dx: (r() - 0.5) * 220,
      dur: 1.6 + r() * 1.2,
      delay: r() * 0.35,
      colour: COLOURS[i % COLOURS.length],
      scale: 0.7 + r() * 0.8,
    }));
  }, [burst]);

  if (!burst || cleared === burst) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              background: p.colour,
              transform: `scale(${p.scale})`,
              "--dx": `${p.dx}px`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
