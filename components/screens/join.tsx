"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { STORES } from "@/lib/locations";
import { PROGRAM } from "@/lib/loyalty";
import { useClub } from "@/lib/store";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function JoinScreen() {
  const router = useRouter();
  const join = useClub((s) => s.join);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [month, setMonth] = useState<number | null>(null);
  const [store, setStore] = useState(STORES[0].id);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError("A name is the only thing we need.");
    join({ name: trimmed, phone: phone.trim() || null, birthdayMonth: month, favouriteStoreId: store });
    router.push("/");
  };

  const field =
    "w-full rounded-2xl bg-raised border border-line px-4 h-13 py-3.5 text-base text-ink placeholder:text-muted/60 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/30";

  return (
    <form onSubmit={submit} className="animate-rise flex flex-col min-h-[75dvh]">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="font-display mt-6 text-4xl font-extrabold leading-none">Join the club.</h1>
      <p className="mt-3 text-muted">
        You get {PROGRAM.welcomePoints} points just for turning up. Only your name is required.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Name</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="What's on the cup?" autoComplete="given-name" autoFocus />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Mobile <span className="text-muted font-normal">(optional, so your points follow you)</span>
          </span>
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04xx xxx xxx" inputMode="tel" autoComplete="tel" />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-semibold">
            Birthday month <span className="text-muted font-normal">(free Dubai cup)</span>
          </span>
          <div className="grid grid-cols-6 gap-1.5">
            {MONTHS.map((m, i) => (
              <button
                type="button"
                key={m}
                onClick={() => setMonth(month === i + 1 ? null : i + 1)}
                className={`h-10 rounded-xl text-sm font-semibold border transition-colors ${month === i + 1 ? "bg-pink border-pink text-white" : "bg-raised border-line text-muted hover:text-ink"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Your usual store</span>
          <select className={field} value={store} onChange={(e) => setStore(e.target.value)}>
            {STORES.filter((s) => !s.comingSoon).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-pink-soft">{error}</p>}

      <div className="mt-auto pt-8">
        <Button type="submit" size="lg" full>
          Create my card <ArrowRight size={20} weight="bold" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted">Pitch build. Your details stay on this device and never leave it.</p>
      </div>
    </form>
  );
}
