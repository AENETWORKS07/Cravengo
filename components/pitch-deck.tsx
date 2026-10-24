"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, DeviceMobile, Moon, Fire, Sparkle, ChartLineUp, Flag } from "@phosphor-icons/react";
import { BRAND } from "@/lib/brand";
import { PROGRAM } from "@/lib/loyalty";
import { STORES } from "@/lib/locations";
import { cx } from "./ui";

type Slide = { id: string; body: ReactNode };

const openStores = STORES.filter((s) => !s.comingSoon).length;

const SLIDES: Slide[] = [
  {
    id: "title",
    body: (
      <div className="flex h-full flex-col justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">{BRAND.name} · {BRAND.city}</p>
        <div>
          <h1 className="font-display text-[14vw] leading-[0.9] font-extrabold md:text-[120px]">
            Dessert
            <br />
            <span className="text-pink">pays</span> you
            <br />
            back.
          </h1>
          <p className="mt-8 max-w-xl text-xl text-muted md:text-2xl">
            {BRAND.appName}: a loyalty program built for a dessert chain that trades after dark.
          </p>
        </div>
        <p className="text-muted">→ to advance. Esc for the app.</p>
      </div>
    ),
  },
  {
    id: "problem",
    body: (
      <Section kicker="The problem" title="You have the queue. The apps have the customer.">
        <ul className="grid gap-4 md:grid-cols-3">
          <Fact big="25–35%" small="of every delivery order goes to the platform, which keeps the customer's name, number and history. You get a docket." />
          <Fact big={`${openStores} stores`} small="and no way to know that the Carlton regular is the same person who tried Campbellfield last Friday." />
          <Fact big="0 reasons" small="to come back on a Tuesday instead of a Friday. Demand piles into the hours you are already slammed." />
        </ul>
        <p className="mt-8 max-w-2xl text-lg text-muted">
          Late-night dessert is an impulse. The brand that owns the impulse owns the night. Right now the impulse is owned by whichever app is open on the phone.
        </p>
      </Section>
    ),
  },
  {
    id: "program",
    body: (
      <Section kicker="The program" title="Three rules. Fits on a poster.">
        <ol className="grid gap-4 md:grid-cols-3">
          <Rule n={1} Icon={Sparkle} title={`${PROGRAM.pointsPerDollar} points per $1`} text="Spend $17.50 on a bowl, bank 170. No tiers to understand on day one. Just a number that goes up." />
          <Rule n={2} Icon={Moon} title="Double after 10pm" text="Night Owl. The brand already lives late. Now the loyalty does too. Nobody else in Melbourne can copy this honestly." />
          <Rule n={3} Icon={Fire} title="Every 10th dessert free" text="A stamp card people already understand, done on a phone so it never gets lost in a wallet." />
        </ol>
        <p className="mt-8 text-lg text-muted">
          Tiers, streaks, birthdays and referrals sit underneath for the people who want more. The poster never has to mention them.
        </p>
      </Section>
    ),
  },
  {
    id: "nightowl",
    body: (
      <Section kicker="Why Night Owl works" title="The incentive points at the hours you already pay for.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-lg text-muted">
            <p>Every store is open until 1am. Staff are rostered. Lights are on. The marginal cost of one more bowl at 11pm is the fruit in it.</p>
            <p>Doubling points after 10pm costs almost nothing and gives people a reason to make the late run a habit instead of an accident.</p>
            <p>It is also a story. &ldquo;Points double at ten&rdquo; is a sentence people repeat to friends. &ldquo;Earn rewards&rdquo; is not.</p>
          </div>
          <div className="rounded-[28px] border border-acai/40 bg-gradient-to-br from-[#2d1b69] to-acai-deep p-6">
            <Moon size={40} weight="fill" className="text-gold" />
            <p className="font-display mt-4 text-4xl font-extrabold leading-tight">
              10pm
              <br />
              <span className="text-gold">×2</span>
            </p>
            <p className="mt-3 text-muted">Live in the app. The home screen counts down to it every evening and flips when it lands.</p>
          </div>
        </div>
      </Section>
    ),
  },
  {
    id: "app",
    body: (
      <Section kicker="The app" title="Simple to the customer. Instant on the floor.">
        <div className="grid gap-4 md:grid-cols-4">
          <Step n="01" title="Join in 20 seconds" text="A name. That is the only required field. 100 welcome points before the first order." />
          <Step n="02" title="Show the QR" text="One screen, one code. Staff scan it with any phone. No hardware, no integration on day one." />
          <Step n="03" title="Feel the points land" text="The balance counts up on screen while the order is being made. The moment is the marketing." />
          <Step n="04" title="Redeem with a timer" text="Vouchers expire in 15 minutes so they are used at the counter, not screenshotted and shared." />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-pink px-5 py-3 font-semibold text-white">
            <DeviceMobile size={20} weight="bold" /> Open the live demo
          </Link>
          <span className="text-muted text-sm">Installable on a phone from the browser. No app store review between you and launch.</span>
        </div>
      </Section>
    ),
  },
  {
    id: "numbers",
    body: (
      <Section kicker="The numbers" title="Modelled, not promised. Change every input yourself.">
        <ul className="grid gap-4 md:grid-cols-3">
          <Fact big="~10%" small="effective reward rate at face value. At dessert margins the cost of a free bowl is the fruit, not the price tag." />
          <Fact big="2 inputs" small="decide the whole case: how many customers scan, and how often the scanners come back. Everything else is arithmetic." />
          <Fact big="$0" small="in hardware. The till stays as it is. A staff phone scans the code." />
        </ul>
        <div className="mt-8">
          <Link href="/owner" className="inline-flex items-center gap-2 rounded-full border border-line-strong/50 bg-raised px-5 py-3 font-semibold">
            <ChartLineUp size={20} weight="bold" /> Open the model
          </Link>
        </div>
      </Section>
    ),
  },
  {
    id: "launch",
    body: (
      <Section kicker="Launch" title="One store. Thirty nights. Then everywhere.">
        <ol className="grid gap-4 md:grid-cols-4">
          <Step n="Wk 1" title="Campbellfield pilot" text="Poster and QR at the counter. Staff scan with a phone. Measure the scan rate." />
          <Step n="Wk 3" title="All stores" text={`Roll to the remaining ${openStores - 1} stores once the scan rate clears 30%.`} />
          <Step n="Mo 2" title="Referral + birthday" text="Turn on the growth loops. Members bring members." />
          <Step n="Mo 3" title="Tiers and drops" text="Night Owl, Legend, Icon. Early access to new cups for the people who earned it." />
        </ol>
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-5">
          <Flag size={24} weight="fill" className="text-pink shrink-0 mt-0.5" />
          <p className="text-lg">
            <span className="font-semibold">The ask:</span> one store, thirty nights, two numbers. Scan rate and 30-day repeat rate. If both move, the rest of the rollout pays for itself.
          </p>
        </div>
      </Section>
    ),
  },
];

export function PitchDeck() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((n) => Math.max(0, Math.min(SLIDES.length - 1, n + d))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, router]);

  return (
    <div className="stage flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-pink to-acai font-display text-sm font-extrabold text-white">C</span>
          {BRAND.appName}
        </Link>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, n) => (
            <button key={s.id} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} className={cx("h-1.5 rounded-full transition-all", n === i ? "w-8 bg-pink" : "w-3 bg-line-strong/50")} />
          ))}
        </div>
      </header>

      <main key={i} className="animate-rise flex-1 px-6 py-6 md:px-12 md:py-10 max-w-6xl w-full mx-auto">
        <div className="h-full min-h-[60dvh]">{SLIDES[i].body}</div>
      </main>

      <footer className="flex items-center justify-between px-6 py-5 md:px-12">
        <button onClick={() => go(-1)} disabled={i === 0} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-30">
          <ArrowLeft size={16} weight="bold" /> Back
        </button>
        <span className="tabular text-sm text-muted">
          {i + 1} / {SLIDES.length}
        </span>
        <button onClick={() => go(1)} disabled={i === SLIDES.length - 1} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ground disabled:opacity-30">
          Next <ArrowRight size={16} weight="bold" />
        </button>
      </footer>
    </div>
  );
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink">{kicker}</p>
      <h2 className="font-display mt-3 max-w-4xl text-4xl font-extrabold leading-[1.02] md:text-6xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function Fact({ big, small }: { big: string; small: string }) {
  return (
    <li className="rounded-[24px] border border-line bg-surface p-6">
      <p className="font-display tabular text-4xl font-extrabold md:text-5xl">{big}</p>
      <p className="mt-3 text-muted">{small}</p>
    </li>
  );
}

function Rule({ n, Icon, title, text }: { n: number; Icon: typeof Sparkle; title: string; text: string }) {
  return (
    <li className="rounded-[24px] border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink to-acai text-white">
          <Icon size={24} weight="fill" />
        </span>
        <span className="font-display text-5xl font-extrabold text-line-strong/40">{n}</span>
      </div>
      <p className="font-display mt-5 text-2xl font-bold">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
    </li>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="rounded-[24px] border border-line bg-surface p-5">
      <p className="font-mono text-sm text-pink">{n}</p>
      <p className="font-display mt-2 text-xl font-bold">{title}</p>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </li>
  );
}
