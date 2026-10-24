"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Lock, Timer } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { Qr } from "@/components/qr";
import { Sheet } from "@/components/sheet";
import { Button, ButtonLink, Card, Pill, SectionTitle, cx } from "@/components/ui";
import { PROGRAM, REWARDS, TIERS, formatPoints, rewardById, tierFor, type Reward } from "@/lib/loyalty";
import { useClub, type Redemption } from "@/lib/store";

export function RewardsScreen() {
  const hydrated = useHydrated();
  const { member, points, lifetimePoints, freeDesserts, ledger, redeem, markUsed } = useClub();
  const [picked, setPicked] = useState<Reward | null>(null);
  const [voucher, setVoucher] = useState<Redemption | null>(null);
  const close = useCallback(() => setPicked(null), []);
  const closeVoucher = useCallback(() => setVoucher(null), []);

  if (!hydrated) return <div className="min-h-[60dvh]" aria-busy />;

  if (!member) {
    return (
      <div className="animate-rise space-y-5">
        <h1 className="font-display text-3xl font-extrabold leading-none">Rewards</h1>
        <p className="text-muted">Here is what points buy. Join to start collecting.</p>
        <RewardGrid points={0} lifetime={0} onPick={() => {}} locked />
        <ButtonLink href="/join" size="lg" full>
          Join free
        </ButtonLink>
      </div>
    );
  }

  const tier = tierFor(lifetimePoints);
  const active = ledger
    .filter((e) => e.kind === "redeem")
    .map((e) => (e.kind === "redeem" ? e.redemption : null)!)
    .filter((r) => !r.usedAt && new Date(r.expiresAt) > new Date());

  const confirm = () => {
    if (!picked) return;
    const r = redeem(picked.id);
    setPicked(null);
    if (r) setVoucher(r);
  };

  return (
    <div className="animate-rise space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none">Rewards</h1>
          <p className="mt-2 text-sm text-muted">Spend points. Keep your tier.</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Balance</p>
          <p className="font-display tabular text-3xl font-extrabold leading-none">{formatPoints(points)}</p>
        </div>
      </header>

      {freeDesserts > 0 && (
        <div className="rounded-card bg-gradient-to-r from-gold to-[#ff6a3d] p-4 text-ground">
          <p className="font-display text-lg font-extrabold leading-tight">
            {freeDesserts} free dessert{freeDesserts > 1 ? "s" : ""} from your stamp card
          </p>
          <p className="text-sm font-medium opacity-80">Show your card at the counter. No points needed.</p>
        </div>
      )}

      {active.length > 0 && (
        <section>
          <SectionTitle>Ready to use</SectionTitle>
          <ul className="space-y-2">
            {active.map((r) => {
              const reward = rewardById(r.rewardId)!;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => setVoucher(r)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-pistachio/40 bg-pistachio/10 px-4 py-3 text-left"
                  >
                    <span className="text-2xl">{reward.emoji}</span>
                    <span className="flex-1">
                      <span className="block font-semibold">{reward.name}</span>
                      <span className="block text-xs text-muted">Tap to show voucher · {r.code}</span>
                    </span>
                    <Countdown until={r.expiresAt} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <SectionTitle action={<Pill tone="acai">{tier.name}</Pill>}>Catalogue</SectionTitle>
        <RewardGrid points={points} lifetime={lifetimePoints} onPick={setPicked} />
      </section>

      <Sheet open={!!picked} onClose={close} title={picked?.name}>
        {picked && (
          <div className="space-y-5">
            <div className="grid h-32 place-items-center rounded-2xl text-6xl" style={{ background: `linear-gradient(135deg, ${picked.hue[0]}, ${picked.hue[1]})` }}>
              {picked.emoji}
            </div>
            <p className="text-muted">{picked.blurb}</p>
            <div className="flex items-center justify-between rounded-2xl bg-raised px-4 py-3 text-sm">
              <span className="text-muted">Cost</span>
              <span className="tabular font-bold">{formatPoints(picked.cost)} pts</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-raised px-4 py-3 text-sm">
              <span className="text-muted">Balance after</span>
              <span className="tabular font-bold">{formatPoints(points - picked.cost)} pts</span>
            </div>
            <p className="text-xs text-muted">The voucher is good for {PROGRAM.voucherMinutes} minutes once revealed, so redeem at the counter.</p>
            <Button size="lg" full onClick={confirm} disabled={points < picked.cost}>
              Redeem for {formatPoints(picked.cost)}
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet open={!!voucher} onClose={closeVoucher} title="Voucher">
        {voucher && (
          <Voucher
            redemption={voucher}
            onUsed={() => {
              markUsed(voucher.id);
              setVoucher(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function RewardGrid({ points, lifetime, onPick, locked }: { points: number; lifetime: number; onPick: (r: Reward) => void; locked?: boolean }) {
  const tierIndex = TIERS.findIndex((t) => t.id === tierFor(lifetime).id);
  return (
    <ul className="grid grid-cols-2 gap-3">
      {REWARDS.map((r) => {
        const needIndex = r.minTier ? TIERS.findIndex((t) => t.id === r.minTier) : 0;
        const tierLocked = needIndex > tierIndex;
        const affordable = points >= r.cost && !tierLocked && !locked;
        return (
          <li key={r.id}>
            <button
              onClick={() => !tierLocked && !locked && onPick(r)}
              disabled={tierLocked || locked}
              className={cx(
                "relative flex w-full flex-col overflow-hidden rounded-card border text-left transition-transform active:scale-[0.98]",
                affordable ? "border-pistachio/50" : "border-line",
                (tierLocked || locked) && "opacity-70",
              )}
            >
              <div className="grid h-24 w-full place-items-center text-4xl" style={{ background: `linear-gradient(135deg, ${r.hue[0]}, ${r.hue[1]})` }}>
                {tierLocked ? <Lock size={28} weight="fill" className="text-white/90" /> : r.emoji}
              </div>
              <div className="w-full bg-surface p-3">
                <p className="font-semibold leading-tight line-clamp-2 min-h-[2.5em]">{r.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={cx("tabular text-sm font-bold", affordable ? "text-pistachio" : "text-muted")}>{formatPoints(r.cost)} pts</span>
                  {tierLocked ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{TIERS[needIndex].name}+</span>
                  ) : affordable ? (
                    <Check size={16} weight="bold" className="text-pistachio" />
                  ) : null}
                </div>
                {!affordable && !tierLocked && !locked && (
                  <div className="mt-2 h-1 rounded-full bg-raised overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink to-acai" style={{ width: `${Math.min(100, (points / r.cost) * 100)}%` }} />
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Countdown({ until }: { until: string }) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(until).getTime() - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(until).getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [until]);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return (
    <span className="tabular inline-flex items-center gap-1 text-xs font-bold text-pistachio">
      <Timer size={14} weight="fill" />
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}

function Voucher({ redemption, onUsed }: { redemption: Redemption; onUsed: () => void }) {
  const reward = rewardById(redemption.rewardId)!;
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto w-fit rounded-3xl bg-white p-4">
        <Qr value={`cravengo:voucher:${redemption.code}`} size={200} />
      </div>
      <div>
        <p className="font-display text-2xl font-extrabold">{reward.name}</p>
        <p className="font-mono mt-1 tracking-[0.3em] text-muted">{redemption.code}</p>
      </div>
      <Card className="flex items-center justify-between">
        <span className="text-sm text-muted">Expires in</span>
        <Countdown until={redemption.expiresAt} />
      </Card>
      <p className="text-xs text-muted">Staff scan this, or tap the code into the till. Marking it used is the staff step in this demo.</p>
      <Button variant="secondary" full onClick={onUsed}>
        <Check size={18} weight="bold" /> Staff: mark as used
      </Button>
    </div>
  );
}
