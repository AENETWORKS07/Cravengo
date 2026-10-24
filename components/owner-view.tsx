"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Info } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { DemoTag, cx } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { STORES } from "@/lib/locations";
import { AVERAGE_TICKET_CENTS, PROGRAM, REWARDS, formatPoints } from "@/lib/loyalty";
import { useClub } from "@/lib/store";

/* Two-series palette for the gain/cost bar, validated for CVD against the
   dark surface with the dataviz validator. Pink is the brand; the gain hue
   was chosen to stay separable from it under deutan simulation. */
const GAIN = "#2f9fcf";
const COST = "#ff3d81";

type Inputs = {
  stores: number;
  ordersPerNight: number;
  ticketCents: number;
  adoption: number; // share of orders scanned, 0-1
  uplift: number; // extra visits from members, 0-1
  redemption: number; // share of earned points that get redeemed, 0-1
  cogs: number; // food cost share of menu price, 0-1
};

const DEFAULTS: Inputs = {
  stores: STORES.filter((s) => !s.comingSoon).length,
  ordersPerNight: 120,
  ticketCents: AVERAGE_TICKET_CENTS,
  adoption: 0.35,
  uplift: 0.2,
  redemption: 0.7,
  cogs: 0.3,
};

/** Face value of a point: the catalogue prices a $17 bowl at 1,700 points. */
const POINT_VALUE_CENTS = 1700 / REWARDS.find((r) => r.id === "acai")!.cost;

function model(i: Inputs) {
  const ordersPerYear = i.stores * i.ordersPerNight * 365;
  const revenue = ordersPerYear * i.ticketCents;
  const memberRevenue = revenue * i.adoption;
  const incremental = memberRevenue * i.uplift;
  const pointsIssued = ((memberRevenue + incremental) / 100) * PROGRAM.pointsPerDollar * 1.15; // Night Owl lifts the blended rate ~15%
  const faceValue = pointsIssued * POINT_VALUE_CENTS * i.redemption;
  const rewardCogs = faceValue * i.cogs;
  const net = incremental * (1 - i.cogs) - rewardCogs;
  const scansPerYear = ordersPerYear * i.adoption;
  return { ordersPerYear, revenue, memberRevenue, incremental, pointsIssued, faceValue, rewardCogs, net, scansPerYear, rewardRate: faceValue / (memberRevenue + incremental) };
}

const money = (cents: number) => {
  const d = cents / 100;
  if (Math.abs(d) >= 1_000_000) return `$${(d / 1_000_000).toFixed(2)}M`;
  if (Math.abs(d) >= 1_000) return `$${Math.round(d / 1000)}K`;
  return `$${Math.round(d)}`;
};
const pct = (x: number) => `${Math.round(x * 100)}%`;

export function OwnerView() {
  const [i, setI] = useState<Inputs>(DEFAULTS);
  const m = model(i);
  const set = (k: keyof Inputs) => (v: number) => setI((s) => ({ ...s, [k]: v }));

  return (
    <div className="stage min-h-dvh">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-10 md:py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to the app
        </Link>
        <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink">Owner view</p>
            <h1 className="font-display mt-2 text-4xl font-extrabold leading-none md:text-5xl">The model</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Every number below is arithmetic on the sliders. Nothing is live sales data. Move the two that matter, scan rate and repeat uplift, and watch the year change.
            </p>
          </div>
          <Link href="/pitch" className="rounded-full border border-line-strong/50 bg-raised px-4 py-2 text-sm font-semibold">
            Back to the pitch
          </Link>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <Tile label="Incremental revenue / yr" value={money(m.incremental)} note={`${pct(i.uplift)} more visits from the ${pct(i.adoption)} who scan`} />
          <Tile label="Reward cost at COGS / yr" value={money(m.rewardCogs)} note={`${money(m.faceValue)} face value × ${pct(i.cogs)} food cost`} />
          <Tile label="Net contribution / yr" value={money(m.net)} note="Incremental gross margin less reward cost" accent={m.net >= 0 ? "good" : "bad"} />
          <Tile label="Effective reward rate" value={pct(m.rewardRate)} note="Face value of redeemed points over member spend" />
        </section>

        <section className="mt-6 rounded-[24px] border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Where the year lands</h2>
            <ul className="flex gap-4 text-xs text-muted">
              <li className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: GAIN }} /> Incremental gross margin
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COST }} /> Reward cost
              </li>
            </ul>
          </div>
          <StackBar gain={m.incremental * (1 - i.cogs)} cost={m.rewardCogs} />
          <p className="mt-3 text-xs text-muted flex items-start gap-1.5">
            <Info size={14} className="mt-0.5 shrink-0" />
            Night Owl lifts the blended earn rate by about 15% in the model, on the assumption that roughly a third of late-trading orders land after 10pm. Change it in code if the tills say otherwise.
          </p>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-line bg-surface p-5 space-y-5">
            <h2 className="font-display text-lg font-bold">The two that matter</h2>
            <Slider label="Orders scanned" value={i.adoption} min={0.05} max={0.9} step={0.05} fmt={pct} onChange={set("adoption")} hint="Share of orders where the customer shows the QR. Good programs clear 40%." />
            <Slider label="Repeat uplift" value={i.uplift} min={0} max={0.6} step={0.05} fmt={pct} onChange={set("uplift")} hint="Extra visits from members versus the same person without a card. 15–25% is typical for food." />
          </div>
          <div className="rounded-[24px] border border-line bg-surface p-5 space-y-5">
            <h2 className="font-display text-lg font-bold">The business</h2>
            <Slider label="Stores" value={i.stores} min={1} max={12} step={1} fmt={(v) => `${v}`} onChange={set("stores")} />
            <Slider label="Orders per store per night" value={i.ordersPerNight} min={40} max={400} step={10} fmt={(v) => `${v}`} onChange={set("ordersPerNight")} hint="Assumption. Replace with the till average." />
            <Slider label="Average ticket" value={i.ticketCents} min={900} max={3500} step={50} fmt={(v) => `$${(v / 100).toFixed(2)}`} onChange={set("ticketCents")} hint="Default is the dessert menu average from the listings." />
            <Slider label="Points redeemed" value={i.redemption} min={0.2} max={1} step={0.05} fmt={pct} onChange={set("redemption")} hint="Breakage. Points never redeemed cost nothing." />
            <Slider label="Food cost" value={i.cogs} min={0.15} max={0.5} step={0.01} fmt={pct} onChange={set("cogs")} />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Tile label="Orders modelled / yr" value={formatPoints(Math.round(m.ordersPerYear))} note={`${i.stores} stores × ${i.ordersPerNight} × 365`} small />
          <Tile label="Scans / yr" value={formatPoints(Math.round(m.scansPerYear))} note="Each one is a name, a number and a history you own" small />
          <Tile label="Points issued / yr" value={formatPoints(Math.round(m.pointsIssued))} note={`Worth ${money(m.pointsIssued * POINT_VALUE_CENTS)} at face value before breakage`} small />
        </section>

        <ThisDevice />

        <p className="mt-10 text-xs text-muted">
          Model for {BRAND.name}. Defaults: {DEFAULTS.stores} open stores, {DEFAULTS.ordersPerNight} orders a night, ${(DEFAULTS.ticketCents / 100).toFixed(2)} average ticket, {pct(DEFAULTS.adoption)} scanned, {pct(DEFAULTS.uplift)} uplift, {pct(DEFAULTS.redemption)} redeemed, {pct(DEFAULTS.cogs)} food cost. Only the ticket is sourced; the rest are placeholders to be replaced with till data.
        </p>
      </div>
    </div>
  );
}

function Tile({ label, value, note, accent, small }: { label: string; value: string; note: string; accent?: "good" | "bad"; small?: boolean }) {
  return (
    <div className="rounded-[24px] border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={cx("font-display tabular mt-2 font-extrabold leading-none", small ? "text-3xl" : "text-4xl md:text-[44px]", accent === "good" && "text-pistachio", accent === "bad" && "text-pink-soft")}>{value}</p>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

function StackBar({ gain, cost }: { gain: number; cost: number }) {
  const total = Math.max(1, gain + cost);
  const g = (gain / total) * 100;
  return (
    <div className="mt-4">
      <div className="flex h-10 w-full gap-[2px] overflow-hidden rounded-md" role="img" aria-label={`Incremental gross margin ${money(gain)}, reward cost ${money(cost)}`}>
        <div className="grid place-items-center text-xs font-semibold text-ground" style={{ width: `${g}%`, background: GAIN }} title={`Incremental gross margin ${money(gain)}`}>
          {g > 18 && money(gain)}
        </div>
        <div className="grid place-items-center text-xs font-semibold text-white" style={{ width: `${100 - g}%`, background: COST }} title={`Reward cost ${money(cost)}`}>
          {100 - g > 18 && money(cost)}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>Gain {money(gain)}</span>
        <span>Cost {money(cost)}</span>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, fmt, onChange, hint }: { label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="tabular font-bold text-pink-soft">{fmt(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-pink" />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function ThisDevice() {
  const hydrated = useHydrated();
  const { member, ledger, points, lifetimePoints } = useClub();
  if (!hydrated || !member) return null;
  const visits = ledger.filter((e) => e.kind === "visit");
  const spend = visits.reduce((s, e) => (e.kind === "visit" ? s + e.visit.subtotalCents : s), 0);
  const night = visits.filter((e) => e.kind === "visit" && e.visit.nightOwl).length;
  return (
    <section className="mt-8 rounded-[24px] border border-dashed border-gold/40 bg-gold/5 p-5">
      <div className="flex items-center gap-2">
        <DemoTag>This device</DemoTag>
        <h2 className="font-display text-lg font-bold">What the demo on this phone has recorded</h2>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Member", member.name],
          ["Visits", `${visits.length}`],
          ["Spend", money(spend)],
          ["Night Owl visits", `${night}`],
          ["Points held", formatPoints(points)],
          ["Lifetime points", formatPoints(lifetimePoints)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="font-display tabular text-xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
