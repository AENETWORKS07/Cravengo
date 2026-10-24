"use client";

import { useMemo } from "react";
import QRCode from "qrcode";

/**
 * Renders a QR as inline SVG so it scales crisply on any screen and needs no
 * canvas. Dark modules on a light tile because scanners at a counter read
 * that far more reliably than an inverted code.
 */
export function Qr({ value, size = 180, className }: { value: string; size?: number; className?: string }) {
  const { modules, count } = useMemo(() => {
    const code = QRCode.create(value, { errorCorrectionLevel: "M" });
    return { modules: code.modules.data as Uint8Array, count: code.modules.size };
  }, [value]);

  const path = useMemo(() => {
    let d = "";
    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        if (modules[y * count + x]) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return d;
  }, [modules, count]);

  const quiet = 2;
  const view = count + quiet * 2;

  return (
    <svg
      viewBox={`0 0 ${view} ${view}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`QR code ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={view} height={view} fill="#fff" rx={1.5} />
      <path d={path} fill="#0b0712" transform={`translate(${quiet} ${quiet})`} />
    </svg>
  );
}
