"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Moon, Receipt, Storefront, Sparkle, X } from "@phosphor-icons/react";
import { Confetti } from "@/components/confetti";
import { useHydrated } from "@/components/hydrated";
import { Qr } from "@/components/qr";
import { Sheet } from "@/components/sheet";
import { useNight } from "@/components/use-night";
import { Button, ButtonLink, Card, DemoTag, Pill, cx } from "@/components/ui";
import { useBasket } from "@/lib/basket";
import { STORES } from "@/lib/locations";
import { PROGRAM, formatMoney, formatPoints, pointsFor, subtotalCents, tierFor } from "@/lib/loyalty";
import { MENU, menuById } from "@/lib/menu";
import { useClub, type Visit } from "@/lib/store";

export function EarnScreen() {
  const hydrated = useHydrated();
  const params = useSearchParams();
  const router = useRouter();
  const { member, points, lifetimePoints, freeDesserts, recordVisit, pretendNight, setPretendNight } = useClub();
  const basket = useBasket();
  const { night, realNight } = useNight();
  const fromMenu = params.get("demo") === "1";
  const [open, setOpen] = useState(fromMenu);
  const [result, setResult] = useState<Visit | null>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    // Drop the ?demo flag so a refresh does not reopen the sheet.
    if (fromMenu) router.replace("/earn");
  }, [fromMenu, router]);

  const close = useCallback(() => setOpen(false), []);

  if (!hydrated) return <div className="min-h-[60dvh]" aria-busy />;

  if (!member) {
    return (
      <div className="animate-rise flex min-h-[70dvh] flex-col items-center justify-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-pink to-acai text-white">
          <Receipt size={40} weight="fill" />
        </span>
        <h1 className="font-display mt-6 text-3xl font-extrabold">Your card lives here.</h1>
        <p className="mt-2 text-muted">Join and this screen becomes the QR you show at the counter.</p>
        <ButtonLink href="/join" size="lg" className="mt-8">
          Join free
        </ButtonLink>
      </div>
    );
  }

  const tier = tierFor(lifetimePoints);

  const confirm = () => {
    const storeId = basket.storeId ?? member.favouriteStoreId;
    const visit = recordVisit(storeId, basket.itemIds);
    if (!visit) return;
    basket.clear();
    setOpen(false);
    setResult(visit);
    setBurst((b) => b + 1);
  };

  return (
    <div className="animate-rise space-y-6">
      <Confetti burst={burst} />
      <header className="text-center">
        <h1 className="font-display text-3xl font-extrabold leading-none">Show this at the counter</h1>
        <p className="mt-2 text-sm text-muted">Staff scan it before you pay. Points land before your dessert does.</p>
      </header>

      <div className="relative mx-auto w-fit rounded-[28px] bg-white p-4 shadow-[0_30px_80px_-30px_rgba(255,61,129,0.6)]">
        <Qr value={`cravengo:member:${member.id}`} size={232} />
        <p className="font-mono mt-2 text-center text-xs text-[#5a4d6e] tracking-widest">{member.id.toUpperCase()}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <Pill tone="acai">{tier.name} ×{tier.multiplier}</Pill>
        {night && (
          <Pill tone="gold">
            <Moon size={12} weight="fill" /> Night Owl ×2
          </Pill>
        )}
        {freeDesserts > 0 && <Pill tone="pistachio">{freeDesserts} free dessert{freeDesserts > 1 ? "s" : ""}</Pill>}
      </div>

      <Card className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted font-bold">Balance</p>
        <p className="font-display tabular mt-1 text-4xl font-extrabold">{formatPoints(points)}</p>
      </Card>

      <div className="rounded-card border border-dashed border-gold/50 bg-gold/5 p-4">
        <div className="flex items-center gap-2">
          <DemoTag />
          <p className="font-semibold">No scanner handy?</p>
        </div>
        <p className="mt-1 text-sm text-muted">Simulate what happens at the till. Pick items, see the maths, watch the points land.</p>
        <Button full className="mt-3" onClick={() => setOpen(true)}>
          <Sparkle size={18} weight="fill" /> Demo a visit{basket.itemIds.length ? ` (${basket.itemIds.length} picked)` : ""}
        </Button>
      </div>

      <Sheet open={open} onClose={close} title="Demo a visit">
        <DemoVisit
          itemIds={basket.itemIds}
          toggle={basket.toggle}
          storeId={basket.storeId ?? member.favouriteStoreId}
          setStore={basket.setStore}
          night={night}
          realNight={realNight}
          pretendNight={pretendNight}
          setPretendNight={setPretendNight}
          lifetimePoints={lifetimePoints}
          onConfirm={confirm}
        />
      </Sheet>

      {result && <EarnResult visit={result} onClose={() => setResult(null)} />}
    </div>
  );
}

function DemoVisit({
  itemIds,
  toggle,
  storeId,
  setStore,
  night,
  realNight,
  pretendNight,
  setPretendNight,
  lifetimePoints,
  onConfirm,
}: {
  itemIds: string[];
  toggle: (id: string) => void;
  storeId: string;
  setStore: (id: string) => void;
  night: boolean;
  realNight: boolean;
  pretendNight: boolean;
  setPretendNight: (v: boolean) => void;
  lifetimePoints: number;
  onConfirm: () => void;
}) {
  const earn = pointsFor(itemIds, night ? 23 : 12, lifetimePoints);
  const subtotal = subtotalCents(itemIds);
  const tier = tierFor(lifetimePoints);
  const popular = MENU.filter((m) => ["acai", "dubai-cup", "loaded-waffles", "cheesecake-pistachio", "sugarcane", "crave-cup"].includes(m.id));

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold flex items-center gap-1.5">
          <Storefront size={16} weight="fill" className="text-pink" /> Store
        </p>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {STORES.filter((s) => !s.comingSoon).map((s) => (
            <button
              key={s.id}
              onClick={() => setStore(s.id)}
              className={cx("shrink-0 rounded-full border px-3 h-9 text-sm font-semibold", storeId === s.id ? "bg-ink text-ground border-ink" : "border-line bg-raised text-muted")}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Order</p>
        <div className="grid grid-cols-3 gap-2">
          {popular.map((m) => {
            const n = itemIds.filter((i) => i === m.id).length;
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={cx("relative rounded-2xl border p-2 text-left transition-colors", n ? "border-pink bg-pink/10" : "border-line bg-raised")}
              >
                <span className="text-2xl">{m.emoji}</span>
                <p className="mt-1 text-xs font-semibold leading-tight line-clamp-2">{m.name}</p>
                <p className="tabular text-xs text-muted">{formatMoney(m.priceCents)}</p>
                {n > 0 && <span className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold text-white">{n}</span>}
              </button>
            );
          })}
        </div>
        {itemIds.some((id) => !popular.find((p) => p.id === id)) && (
          <p className="mt-2 text-xs text-muted">
            Also in the order: {itemIds.filter((id) => !popular.find((p) => p.id === id)).map((id) => menuById(id)?.name).join(", ")}
          </p>
        )}
        <Link href="/menu" className="mt-2 inline-block text-xs font-semibold text-pink-soft">
          Full menu →
        </Link>
      </div>

      <label className="flex items-center justify-between rounded-2xl border border-line bg-raised px-4 py-3">
        <span className="flex items-center gap-2">
          <Moon size={18} weight="fill" className="text-gold" />
          <span>
            <span className="block text-sm font-semibold">{realNight ? "It is after 10pm. Night Owl is live." : "Pretend it is 11pm"}</span>
            <span className="block text-xs text-muted">{realNight ? "Nothing to flip." : "Demo switch. Shows the double-points moment."}</span>
          </span>
        </span>
        <input
          type="checkbox"
          className="h-6 w-11 appearance-none rounded-full bg-line checked:bg-gold relative transition-colors before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-5 disabled:opacity-50"
          checked={pretendNight || realNight}
          disabled={realNight}
          onChange={(e) => setPretendNight(e.target.checked)}
        />
      </label>

      <div className="rounded-2xl bg-ground border border-line p-4 text-sm space-y-1.5">
        <Row label="Subtotal" value={formatMoney(subtotal)} />
        <Row label={`${PROGRAM.pointsPerDollar} pts per $1`} value={`${earn.base}`} />
        {night && <Row label="Night Owl ×2" value={`${earn.base * 2}`} tone="gold" />}
        {tier.multiplier > 1 && <Row label={`${tier.name} ×${tier.multiplier}`} value={`${earn.total}`} tone="acai" />}
        <div className="my-2 border-t border-line" />
        <Row label="Points earned" value={formatPoints(earn.total)} big />
        <Row label="Stamps" value={`+${earn.stamps}`} />
      </div>

      <Button size="lg" full disabled={itemIds.length === 0} onClick={onConfirm}>
        Pay {formatMoney(subtotal)} and earn {formatPoints(earn.total)}
      </Button>
    </div>
  );
}

function Row({ label, value, big, tone }: { label: string; value: string; big?: boolean; tone?: "gold" | "acai" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cx(big ? "font-semibold" : "text-muted", tone === "gold" && "text-gold", tone === "acai" && "text-[#d9b8ff]")}>{label}</span>
      <span className={cx("tabular", big ? "font-display text-2xl font-extrabold text-pistachio" : "font-semibold")}>{value}</span>
    </div>
  );
}

function EarnResult({ visit, onClose }: { visit: Visit; onClose: () => void }) {
  const bonus = visit.bonuses.reduce((a, b) => a + b.points, 0);
  const freebie = visit.bonuses.find((b) => b.points === 0);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-pop relative w-full max-w-sm rounded-[28px] bg-gradient-to-br from-pink to-acai p-6 text-center text-white shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/20" aria-label="Close">
          <X size={16} weight="bold" />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-80">{visit.nightOwl ? "Night Owl" : "Nice"}</p>
        <p className="font-display tabular mt-3 text-7xl font-extrabold leading-none">+{formatPoints(visit.points + bonus)}</p>
        <p className="mt-2 text-lg font-semibold">points</p>
        <p className="mt-4 text-sm opacity-90">
          {visit.itemIds.map((id) => menuById(id)?.name).join(", ")} · {formatMoney(visit.subtotalCents)}
          {visit.nightOwl ? " · doubled" : ""}
        </p>
        {visit.bonuses
          .filter((b) => b.points > 0)
          .map((b) => (
            <p key={b.reason} className="mt-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold inline-block">
              +{b.points} · {b.reason}
            </p>
          ))}
        {freebie && (
          <p className="mt-4 rounded-2xl bg-white text-ground px-4 py-3 font-display font-bold">🎉 {freebie.reason}</p>
        )}
        <ButtonLink href="/rewards" variant="secondary" full className="mt-6 bg-white text-ground border-transparent hover:bg-white/90" onClick={onClose}>
          See what that buys
        </ButtonLink>
      </div>
    </div>
  );
}
