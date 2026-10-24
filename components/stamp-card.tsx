import { PROGRAM } from "@/lib/loyalty";
import { cx } from "./ui";

export function StampCard({ stamps, compact }: { stamps: number; compact?: boolean }) {
  const total = PROGRAM.stampsPerReward;
  return (
    <div className={cx("grid gap-2", compact ? "grid-cols-10" : "grid-cols-5")}>
      {Array.from({ length: total }, (_, i) => {
        const filled = i < stamps;
        const last = i === total - 1;
        return (
          <div
            key={i}
            className={cx(
              "aspect-square rounded-full grid place-items-center text-lg transition-all duration-300 border",
              filled
                ? "bg-gradient-to-br from-pink to-acai border-transparent shadow-[0_6px_20px_-6px_rgba(255,61,129,0.8)] animate-pop"
                : last
                  ? "border-dashed border-gold/60 text-gold"
                  : "border-line bg-raised/60",
              compact && "text-xs",
            )}
            style={{ animationDelay: filled ? `${i * 40}ms` : undefined }}
            aria-label={filled ? "Stamped" : last ? "Free dessert" : "Empty stamp"}
          >
            {filled ? (compact ? "●" : "🍓") : last ? (compact ? "★" : "FREE") : ""}
          </div>
        );
      })}
    </div>
  );
}
