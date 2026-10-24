import { Gift, Moon, Receipt, Sparkle } from "@phosphor-icons/react";
import { storeById } from "@/lib/locations";
import { formatMoney, formatPoints, rewardById } from "@/lib/loyalty";
import { menuById } from "@/lib/menu";
import type { LedgerEntry } from "@/lib/store";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-AU", { weekday: "short", hour: "numeric", minute: "2-digit", timeZone: "Australia/Melbourne" });

export function Ledger({ entries }: { entries: LedgerEntry[] }) {
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {entries.map((e) => {
        if (e.kind === "visit") {
          const v = e.visit;
          const bonus = v.bonuses.reduce((a, b) => a + b.points, 0);
          return (
            <li key={v.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-pink">
                {v.nightOwl ? <Moon size={18} weight="fill" /> : <Receipt size={18} weight="fill" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {v.itemIds.map((id) => menuById(id)?.name ?? id).join(", ")}
                </p>
                <p className="text-xs text-muted truncate">
                  {storeById(v.storeId)?.name} · {when(v.at)} · {formatMoney(v.subtotalCents)}
                  {v.nightOwl ? " · Night Owl ×2" : ""}
                  {v.bonuses.filter((b) => b.points === 0).map((b) => ` · ${b.reason}`)}
                </p>
              </div>
              <p className="tabular text-sm font-bold text-pistachio">+{formatPoints(v.points + bonus)}</p>
            </li>
          );
        }
        if (e.kind === "redeem") {
          const r = rewardById(e.redemption.rewardId);
          return (
            <li key={e.redemption.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-gold">
                <Gift size={18} weight="fill" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r?.name ?? "Reward"}</p>
                <p className="text-xs text-muted">
                  {when(e.redemption.at)} · {e.redemption.usedAt ? "Used" : "Voucher"} {e.redemption.code}
                </p>
              </div>
              <p className="tabular text-sm font-bold text-muted">−{formatPoints(r?.cost ?? 0)}</p>
            </li>
          );
        }
        return (
          <li key={e.id} className="flex items-center gap-3 px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-pistachio">
              <Sparkle size={18} weight="fill" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{e.reason}</p>
              <p className="text-xs text-muted">{when(e.at)}</p>
            </div>
            <p className="tabular text-sm font-bold text-pistachio">+{formatPoints(e.points)}</p>
          </li>
        );
      })}
    </ul>
  );
}
