"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Plus } from "@phosphor-icons/react";
import { useHydrated } from "@/components/hydrated";
import { useNight } from "@/components/use-night";
import { Pill, cx } from "@/components/ui";
import { useBasket } from "@/lib/basket";
import { PROGRAM, formatMoney, pointsFor } from "@/lib/loyalty";
import { CATEGORIES, MENU, type Category, type MenuItem } from "@/lib/menu";
import { useClub } from "@/lib/store";

export function MenuScreen() {
  const [cat, setCat] = useState<Category | "all">("all");
  const items = cat === "all" ? MENU : MENU.filter((m) => m.category === cat);
  const basket = useBasket();
  const hydrated = useHydrated();
  const { night } = useNight();

  return (
    <div className="animate-rise space-y-5">
      <header>
        <h1 className="font-display text-3xl font-extrabold leading-none">Menu</h1>
        <p className="mt-2 text-sm text-muted">
          Every item shows what it earns. {night ? "Night Owl is on, so everything is doubled." : `Points double after ${PROGRAM.nightOwlFromHour - 12}pm.`}
        </p>
      </header>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {[{ id: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cx(
              "shrink-0 rounded-full px-4 h-9 text-sm font-semibold border transition-colors",
              cat === c.id ? "bg-ink text-ground border-ink" : "bg-surface border-line text-muted hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} night={night} count={hydrated ? basket.itemIds.filter((i) => i === item.id).length : 0} onAdd={() => basket.add(item.id)} />
        ))}
      </ul>

      {hydrated && basket.itemIds.length > 0 && (
        <div className="fixed bottom-[92px] left-1/2 z-40 w-[calc(100%-40px)] max-w-[390px] -translate-x-1/2 animate-pop">
          <Link
            href="/earn?demo=1"
            className="flex items-center justify-between rounded-full bg-ink px-5 h-14 text-ground shadow-2xl"
          >
            <span className="font-semibold">
              {basket.itemIds.length} item{basket.itemIds.length > 1 ? "s" : ""} · {formatMoney(basket.itemIds.reduce((s, id) => s + (MENU.find((m) => m.id === id)?.priceCents ?? 0), 0))}
            </span>
            <span className="inline-flex items-center gap-1 font-bold">
              Earn <ArrowRight size={18} weight="bold" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function MenuCard({ item, night, count, onAdd }: { item: MenuItem; night: boolean; count: number; onAdd: () => void }) {
  const lifetime = useClub((s) => s.lifetimePoints);
  const earn = pointsFor([item.id], night ? 23 : 12, lifetime).total;
  return (
    <li className="group relative overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative aspect-[4/3] grid place-items-center text-5xl" style={{ background: `linear-gradient(140deg, ${item.hue[0]}, ${item.hue[1]})` }}>
        <span className="drop-shadow-lg transition-transform group-hover:scale-110">{item.emoji}</span>
        {item.tags?.[0] && (
          <Pill tone={item.tags[0] === "viral" ? "pink" : item.tags[0] === "vegan" ? "pistachio" : "gold"} className="absolute left-2 top-2 bg-black/40 backdrop-blur">
            {item.tags[0]}
          </Pill>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold leading-tight line-clamp-2 min-h-[2.5em]">{item.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="tabular font-bold">{formatMoney(item.priceCents)}</span>
          <span className={cx("tabular text-xs font-bold", night ? "text-gold" : "text-pistachio")}>+{earn} pts</span>
        </div>
        <button
          onClick={onAdd}
          className={cx(
            "mt-3 flex h-10 w-full items-center justify-center gap-1 rounded-full text-sm font-semibold transition-colors",
            count ? "bg-pink text-white" : "bg-raised text-ink hover:bg-line",
          )}
        >
          {count ? (
            <>
              <Check size={16} weight="bold" /> Added{count > 1 ? ` ×${count}` : ""}
            </>
          ) : (
            <>
              <Plus size={16} weight="bold" /> Add
            </>
          )}
        </button>
      </div>
    </li>
  );
}
