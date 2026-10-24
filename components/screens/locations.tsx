"use client";

import { Heart, MapPin, NavigationArrow } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { useMelbourneClock } from "@/components/use-clock";
import { Pill, cx } from "@/components/ui";
import { STORES, hoursLabel, isOpenNow } from "@/lib/locations";
import { useClub } from "@/lib/store";

export function LocationsScreen() {
  const hydrated = useHydrated();
  const member = useClub((s) => s.member);
  const now = useMelbourneClock();
  const openCount = hydrated ? STORES.filter((s) => isOpenNow(s)).length : 0;

  return (
    <div className="animate-rise space-y-5">
      <header>
        <h1 className="font-display text-3xl font-extrabold leading-none">Stores</h1>
        <p className="mt-2 text-sm text-muted">
          {hydrated ? (
            openCount ? (
              <>
                <span className="text-pistachio font-semibold">{openCount} open right now</span> across Melbourne.
              </>
            ) : (
              "Nothing open just now. Doors open from 3pm in Carlton, 5pm everywhere else."
            )
          ) : (
            "Seven stores across Melbourne."
          )}
        </p>
      </header>

      <ul className="space-y-3">
        {STORES.map((s) => {
          const open = hydrated && isOpenNow(s);
          const fav = member?.favouriteStoreId === s.id;
          const q = encodeURIComponent(`Crave N Go ${s.address} ${s.suburb}`);
          return (
            <li key={s.id} className={cx("rounded-card border bg-surface p-4", fav ? "border-pink/50" : "border-line", s.comingSoon && "opacity-80")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-tight flex items-center gap-2">
                    {s.name}
                    {fav && <Heart size={16} weight="fill" className="text-pink" aria-label="Your store" />}
                    {s.flagship && <Pill tone="gold">Flagship</Pill>}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {s.address}
                    {!s.comingSoon && <>, {s.suburb}</>}
                  </p>
                </div>
                {s.comingSoon ? <Pill tone="acai">Soon</Pill> : hydrated ? <Pill tone={open ? "pistachio" : "neutral"}>{open ? "Open" : "Closed"}</Pill> : null}
              </div>
              {!s.comingSoon && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted">Today · {hoursLabel(s, hydrated ? now.weekday : 1)}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${q}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-pink-soft"
                  >
                    <NavigationArrow size={14} weight="fill" /> Directions
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="flex items-start gap-2 text-xs text-muted">
        <MapPin size={14} className="mt-0.5 shrink-0" />
        Hours from cravengo.org, October 2026. The truck still does night markets; follow the socials for where it parks.
      </p>
    </div>
  );
}
