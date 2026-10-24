"use client";

import { Qr } from "./qr";
import { PointsTicker } from "./points-ticker";
import { tierFor } from "@/lib/loyalty";
import type { Member } from "@/lib/store";
import { BRAND } from "@/lib/brand";

export function MemberCard({
  member,
  points,
  lifetimePoints,
  showQr = true,
}: {
  member: Member;
  points: number;
  lifetimePoints: number;
  showQr?: boolean;
}) {
  const tier = tierFor(lifetimePoints);
  return (
    <div
      className="sheen relative rounded-[26px] p-5 text-white shadow-[0_24px_60px_-20px_rgba(123,44,191,0.8)]"
      style={{ background: `linear-gradient(135deg, ${tier.hue[0]} 0%, ${tier.hue[1]} 100%)` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">{BRAND.appName}</p>
          <p className="font-display text-2xl font-extrabold leading-tight mt-1">{member.name}</p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
          {tier.name}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">Points</p>
          <PointsTicker value={points} className="font-display tabular text-5xl font-extrabold leading-none" />
        </div>
        {showQr && (
          <div className="rounded-2xl bg-white p-1.5 shadow-lg">
            <Qr value={`cravengo:member:${member.id}`} size={84} />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider opacity-80">
        <span className="font-mono normal-case tracking-normal">{member.id.toUpperCase().replace(/(.{4})/g, "$1 ").trim()}</span>
        <span>Since {new Date(member.joinedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}
