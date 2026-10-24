"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Copy, ShareNetwork, Trash } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { Ledger } from "@/components/ledger";
import { Button, ButtonLink, Card, Pill, SectionTitle, cx } from "@/components/ui";
import { ASSUMPTIONS, BRAND } from "@/lib/brand";
import { storeById } from "@/lib/locations";
import { PROGRAM, TIERS, formatPoints, tierFor } from "@/lib/loyalty";
import { useClub } from "@/lib/store";

export function AccountScreen() {
  const hydrated = useHydrated();
  const { member, lifetimePoints, ledger, reset } = useClub();
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!hydrated) return <div className="min-h-[60dvh]" aria-busy />;
  if (!member) {
    return (
      <div className="animate-rise space-y-4">
        <h1 className="font-display text-3xl font-extrabold">Account</h1>
        <p className="text-muted">No card yet.</p>
        <ButtonLink href="/join" full>
          Join free
        </ButtonLink>
        <Rules />
      </div>
    );
  }

  const tier = tierFor(lifetimePoints);
  const share = async () => {
    const text = `Join me on ${BRAND.appName} at ${BRAND.name}. Use my code ${member.referralCode} and we both get ${PROGRAM.referralPoints} points.`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="animate-rise space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Home
      </Link>
      <header className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink to-acai font-display text-2xl font-extrabold text-white">
          {member.name[0]}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-none">{member.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {storeById(member.favouriteStoreId)?.name} regular · {formatPoints(lifetimePoints)} lifetime points
          </p>
        </div>
      </header>

      <section>
        <SectionTitle>Tiers</SectionTitle>
        <ol className="space-y-2">
          {TIERS.map((t, i) => {
            const reached = lifetimePoints >= t.threshold;
            const current = t.id === tier.id;
            return (
              <li key={t.id} className={cx("rounded-2xl border p-4", current ? "border-pink/60 bg-pink/5" : "border-line bg-surface", !reached && "opacity-70")}>
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${t.hue[0]}, ${t.hue[1]})` }} />
                    {t.name}
                    {current && <Pill tone="pink">You</Pill>}
                  </p>
                  <p className="tabular text-sm text-muted">{i === 0 ? "Start" : `${formatPoints(t.threshold)} pts`} · ×{t.multiplier}</p>
                </div>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {t.perks.map((p) => (
                    <li key={p} className="rounded-full bg-raised px-2.5 py-1 text-xs text-muted">
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <SectionTitle>Bring a friend</SectionTitle>
        <Card>
          <p className="text-sm text-muted">Both of you get {PROGRAM.referralPoints} points on their first order.</p>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-ground border border-line px-4 py-3">
            <span className="font-mono text-lg tracking-[0.25em]">{member.referralCode}</span>
            <Button size="sm" variant="secondary" onClick={share}>
              {copied ? <Check size={16} weight="bold" /> : typeof navigator !== "undefined" && "share" in navigator ? <ShareNetwork size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
        </Card>
      </section>

      <section>
        <SectionTitle>Full history</SectionTitle>
        <Ledger entries={ledger} />
      </section>

      <Rules />

      <section>
        <SectionTitle>Pitch build notes</SectionTitle>
        <ul className="space-y-2 text-sm text-muted">
          {ASSUMPTIONS.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="text-gold">•</span>
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-4">
        {confirmReset ? (
          <div className="flex gap-2">
            <Button variant="danger" full onClick={() => { reset(); setConfirmReset(false); }}>
              Yes, wipe it
            </Button>
            <Button variant="secondary" full onClick={() => setConfirmReset(false)}>
              Keep
            </Button>
          </div>
        ) : (
          <Button variant="ghost" full onClick={() => setConfirmReset(true)}>
            <Trash size={16} /> Reset the demo
          </Button>
        )}
      </section>
    </div>
  );
}

function Rules() {
  return (
    <section>
      <SectionTitle>The rules, all of them</SectionTitle>
      <ol className="space-y-2">
        {PROGRAM.rules.map((r, i) => (
          <li key={r} className="flex gap-3 rounded-2xl bg-surface border border-line px-4 py-3 text-sm">
            <span className="font-display font-extrabold text-pink">{i + 1}</span>
            {r}
          </li>
        ))}
      </ol>
    </section>
  );
}
