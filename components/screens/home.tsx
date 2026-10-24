"use client";

import Link from "next/link";
import { ArrowRight, Fire, Moon, Sparkle, Storefront } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { MemberCard } from "@/components/member-card";
import { StampCard } from "@/components/stamp-card";
import { useNight } from "@/components/use-night";
import { ButtonLink, Card, Pill, SectionTitle } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { isOpenNow, hoursLabel, storeById } from "@/lib/locations";
import { useMelbourneClock } from "@/components/use-clock";
import { PROGRAM, REWARDS, formatPoints, nextTier, tierFor } from "@/lib/loyalty";
import { useClub } from "@/lib/store";
import { Ledger } from "@/components/ledger";

export function HomeScreen() {
  const hydrated = useHydrated();
  const member = useClub((s) => s.member);
  if (!hydrated) return <div className="min-h-[60dvh]" aria-busy />;
  return member ? <Dashboard /> : <Welcome />;
}

function Welcome() {
  const { night } = useNight();
  return (
    <div className="animate-rise flex flex-col min-h-[75dvh]">
      <div className="flex items-center gap-2 text-muted text-sm">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-pink to-acai font-display font-extrabold text-white">C</span>
        {BRAND.name}
      </div>
      <h1 className="font-display mt-10 text-[44px] leading-[0.95] font-extrabold">
        Dessert <span className="text-pink">pays</span>
        <br />
        you back.
      </h1>
      <p className="mt-5 text-lg text-muted leading-snug">
        {BRAND.appName} is the {BRAND.name} loyalty club. Three rules, no fine print.
      </p>
      <ul className="mt-6 space-y-3">
        {[
          { Icon: Sparkle, text: "10 points for every $1 you spend." },
          { Icon: Moon, text: "After 10pm, every point is doubled." },
          { Icon: Fire, text: "Every 10th dessert is free." },
        ].map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-2xl bg-surface border border-line px-4 py-3">
            <Icon size={22} weight="fill" className="text-pink shrink-0" />
            <span className="font-medium">{text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8 space-y-3">
        {night && (
          <p className="text-center text-sm text-gold font-semibold">
            <Moon size={14} weight="fill" className="inline -mt-0.5 mr-1" />
            Night Owl is on right now. Join and your first order is doubled.
          </p>
        )}
        <ButtonLink href="/join" size="lg" full>
          Join free, takes 20 seconds <ArrowRight size={20} weight="bold" />
        </ButtonLink>
        <ButtonLink href="/menu" variant="ghost" full>
          Just browsing the menu
        </ButtonLink>
      </div>
    </div>
  );
}

function Dashboard() {
  const { member, points, lifetimePoints, stamps, freeDesserts, streakWeeks, ledger, setPretendNight } = useClub();
  const { night, pretend, minutesUntil } = useNight();
  const clock = useMelbourneClock();
  if (!member) return null;

  const tier = tierFor(lifetimePoints);
  const next = nextTier(lifetimePoints);
  const store = storeById(member.favouriteStoreId);
  const weekday = clock.weekday;
  const open = store ? isOpenNow(store) : false;
  const hour = clock.hour;
  const greeting = hour >= 22 || hour < 5 ? "Late one" : hour >= 17 ? "Evening" : hour >= 12 ? "Afternoon" : "Morning";
  const affordable = REWARDS.filter((r) => r.cost <= points).sort((a, b) => b.cost - a.cost)[0];
  const nextReward = REWARDS.filter((r) => r.cost > points).sort((a, b) => a.cost - b.cost)[0];
  const firstName = member.name.split(" ")[0];

  return (
    <div className="animate-rise space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-muted text-sm">{greeting},</p>
          <h1 className="font-display text-2xl font-extrabold leading-none">{firstName} {hour >= 22 || hour < 5 ? "🌙" : "👋"}</h1>
        </div>
        <Link href="/account" className="grid h-10 w-10 place-items-center rounded-full bg-raised text-ink font-display font-bold" aria-label="Account">
          {firstName[0]}
        </Link>
      </header>

      <MemberCard member={member} points={points} lifetimePoints={lifetimePoints} />

      {/* Night Owl: the brand's whole thing is late. This is the one banner that changes with the clock. */}
      <div
        className={
          night
            ? "rounded-2xl p-4 flex items-center gap-3 bg-gradient-to-r from-[#2d1b69] to-acai-deep border border-acai/50"
            : "rounded-2xl p-4 flex items-center gap-3 bg-surface border border-line"
        }
      >
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${night ? "bg-gold text-ground" : "bg-raised text-gold"}`}>
          <Moon size={22} weight="fill" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold leading-tight">{night ? "Night Owl is on" : "Night Owl starts at 10pm"}</p>
          <p className="text-sm text-muted">
            {night
              ? "Every point doubled until close."
              : `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m until points double.`}
          </p>
        </div>
        <button
          onClick={() => setPretendNight(!pretend)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${pretend ? "bg-gold text-ground" : "bg-raised text-muted"}`}
          title="Demo only: pretend it is 11pm"
        >
          {pretend ? "Demo 11pm" : "Preview"}
        </button>
      </div>

      <section>
        <SectionTitle
          action={
            <span className="text-sm text-muted tabular">
              {stamps}/{PROGRAM.stampsPerReward}
            </span>
          }
        >
          {freeDesserts > 0 ? `${freeDesserts} free dessert${freeDesserts > 1 ? "s" : ""} waiting` : "Next free dessert"}
        </SectionTitle>
        <Card>
          <StampCard stamps={stamps} />
          <p className="mt-3 text-sm text-muted">
            {PROGRAM.stampsPerReward - stamps === 1
              ? "One more dessert and the next one is on us."
              : `${PROGRAM.stampsPerReward - stamps} desserts to go. Drinks earn points, desserts earn the stamp too.`}
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col">
          <Pill tone="pink">Streak</Pill>
          <p className="font-display tabular mt-3 text-3xl font-extrabold leading-none">
            {streakWeeks}
            <span className="text-base text-muted font-sans font-medium"> wk{streakWeeks === 1 ? "" : "s"}</span>
          </p>
          <p className="mt-2 text-xs text-muted leading-snug">
            {streakWeeks % PROGRAM.streakWeeks === 0 && streakWeeks > 0
              ? `Banked ${PROGRAM.streakBonusPoints} bonus.`
              : `${PROGRAM.streakWeeks - (streakWeeks % PROGRAM.streakWeeks)} more week${PROGRAM.streakWeeks - (streakWeeks % PROGRAM.streakWeeks) === 1 ? "" : "s"} for +${PROGRAM.streakBonusPoints}.`}
          </p>
        </Card>
        <Card className="flex flex-col">
          <Pill tone="acai">{tier.name}</Pill>
          {next ? (
            <>
              <p className="font-display tabular mt-3 text-3xl font-extrabold leading-none">{formatPoints(next.threshold - lifetimePoints)}</p>
              <p className="mt-2 text-xs text-muted leading-snug">points to {next.name}, ×{next.multiplier} on everything.</p>
            </>
          ) : (
            <>
              <p className="font-display mt-3 text-3xl font-extrabold leading-none">Top</p>
              <p className="mt-2 text-xs text-muted leading-snug">You are an Icon. There is nowhere higher.</p>
            </>
          )}
        </Card>
      </section>

      <section>
        <SectionTitle action={<Link href="/rewards" className="text-sm font-semibold text-pink-soft">All rewards</Link>}>Rewards</SectionTitle>
        {affordable ? (
          <Link href="/rewards" className="block rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${affordable.hue[0]}, ${affordable.hue[1]})` }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{affordable.emoji}</span>
              <div className="flex-1">
                <p className="font-display font-bold leading-tight">You can get: {affordable.name}</p>
                <p className="text-sm opacity-90">{formatPoints(affordable.cost)} points. Tap to redeem.</p>
              </div>
              <ArrowRight size={20} weight="bold" />
            </div>
          </Link>
        ) : nextReward ? (
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{nextReward.emoji}</span>
              <div className="flex-1">
                <p className="font-display font-bold leading-tight">{formatPoints(nextReward.cost - points)} points to {nextReward.name}</p>
                <div className="mt-2 h-2 rounded-full bg-raised overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink to-acai transition-all duration-700" style={{ width: `${Math.min(100, (points / nextReward.cost) * 100)}%` }} />
                </div>
              </div>
            </div>
          </Card>
        ) : null}
      </section>

      {store && (
        <section>
          <SectionTitle action={<Link href="/locations" className="text-sm font-semibold text-pink-soft">All stores</Link>}>Your store</SectionTitle>
          <Card className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised text-pink">
              <Storefront size={22} weight="fill" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{store.name}</p>
              <p className="text-sm text-muted truncate">{store.comingSoon ? "Opening soon" : hoursLabel(store, weekday)}</p>
            </div>
            <Pill tone={open ? "pistachio" : "neutral"}>{open ? "Open now" : "Closed"}</Pill>
          </Card>
        </section>
      )}

      <section>
        <SectionTitle>Activity</SectionTitle>
        {ledger.length ? <Ledger entries={ledger.slice(0, 5)} /> : <p className="text-sm text-muted">No visits yet.</p>}
        {ledger.length <= 1 && (
          <ButtonLink href="/earn" variant="secondary" full className="mt-3">
            Try a demo visit
          </ButtonLink>
        )}
      </section>

      <p className="text-center text-xs text-muted pt-2">Hours and prices from {BRAND.url.replace("https://", "")}.</p>
    </div>
  );
}
