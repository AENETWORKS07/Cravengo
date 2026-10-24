import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg" | "sm";
  full?: boolean;
  className?: string;
  children: ReactNode;
};

const variants = {
  primary: "bg-pink text-white shadow-[0_8px_30px_-8px_rgba(255,61,129,0.7)] hover:bg-[#ff5a93] active:scale-[0.98]",
  secondary: "bg-raised text-ink border border-line-strong/40 hover:border-line-strong active:scale-[0.98]",
  ghost: "bg-transparent text-muted hover:text-ink",
  danger: "bg-transparent text-pink-soft border border-pink/40 hover:bg-pink/10",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-ground";

export function Button({
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  ...rest
}: ButtonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cx(base, variants[variant], sizes[size], full && "w-full", className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  ...rest
}: ButtonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={cx(base, variants[variant], sizes[size], full && "w-full", className)} {...rest}>
      {children}
    </Link>
  );
}

export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cx("rounded-card bg-surface border border-line p-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function Pill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "pink" | "acai" | "pistachio" | "gold" | "mint";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    neutral: "bg-raised text-muted",
    pink: "bg-pink/15 text-pink-soft",
    acai: "bg-acai/25 text-[#d9b8ff]",
    pistachio: "bg-pistachio/15 text-pistachio",
    gold: "bg-gold/15 text-gold",
    mint: "bg-mint/15 text-mint",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <h2 className="font-display text-lg font-bold text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function DemoTag({ children = "Demo" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
      {children}
    </span>
  );
}
