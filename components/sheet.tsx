"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-slide-up relative w-full max-w-[430px] max-h-[88dvh] overflow-y-auto rounded-t-[28px] border-t border-line bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line-strong/60" />
        <div className="mb-3 flex items-center justify-between">
          {title ? <h2 className="font-display text-xl font-bold">{title}</h2> : <span />}
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-raised text-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
