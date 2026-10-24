"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { melbourneNow } from "./locations";
import { PROGRAM, pointsFor, rewardById, subtotalCents, tierFor, weekKey, weeksApart } from "./loyalty";

export type Member = {
  id: string;
  name: string;
  phone: string | null;
  birthdayMonth: number | null;
  favouriteStoreId: string;
  joinedAt: string;
  referralCode: string;
};

export type Visit = {
  id: string;
  at: string;
  storeId: string;
  itemIds: string[];
  subtotalCents: number;
  points: number;
  nightOwl: boolean;
  stamps: number;
  /** Points awarded on top of the visit, with a reason. */
  bonuses: { reason: string; points: number }[];
};

export type Redemption = {
  id: string;
  rewardId: string;
  at: string;
  code: string;
  expiresAt: string;
  usedAt: string | null;
};

export type LedgerEntry =
  | { kind: "visit"; visit: Visit }
  | { kind: "redeem"; redemption: Redemption }
  | { kind: "bonus"; id: string; at: string; reason: string; points: number };

type State = {
  member: Member | null;
  points: number;
  lifetimePoints: number;
  stamps: number;
  freeDesserts: number;
  streakWeeks: number;
  lastVisitWeek: number | null;
  ledger: LedgerEntry[];
  /** Demo switch: pretend it is 11pm so Night Owl shows in a daytime pitch. */
  pretendNight: boolean;
  lastEarn: { points: number; nightOwl: boolean; at: string } | null;
};

type Actions = {
  join: (m: Omit<Member, "id" | "joinedAt" | "referralCode">) => void;
  recordVisit: (storeId: string, itemIds: string[]) => Visit | null;
  redeem: (rewardId: string) => Redemption | null;
  markUsed: (redemptionId: string) => void;
  setPretendNight: (v: boolean) => void;
  clearLastEarn: () => void;
  reset: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const makeCode = (name: string) =>
  (name.replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase() || "CRAVE") + "-" + Math.floor(1000 + Math.random() * 9000);

const initial: State = {
  member: null,
  points: 0,
  lifetimePoints: 0,
  stamps: 0,
  freeDesserts: 0,
  streakWeeks: 0,
  lastVisitWeek: null,
  ledger: [],
  pretendNight: false,
  lastEarn: null,
};

export function effectiveHour(pretendNight: boolean, date = new Date()) {
  return pretendNight ? 23 : melbourneNow(date).hour;
}

export const useClub = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      join: (m) => {
        const member: Member = {
          ...m,
          id: uid(),
          joinedAt: new Date().toISOString(),
          referralCode: makeCode(m.name),
        };
        const welcome: LedgerEntry = {
          kind: "bonus",
          id: uid(),
          at: member.joinedAt,
          reason: "Welcome to Crave Club",
          points: PROGRAM.welcomePoints,
        };
        set({
          ...initial,
          member,
          points: PROGRAM.welcomePoints,
          lifetimePoints: PROGRAM.welcomePoints,
          ledger: [welcome],
          lastEarn: { points: PROGRAM.welcomePoints, nightOwl: false, at: member.joinedAt },
        });
      },

      recordVisit: (storeId, itemIds) => {
        const s = get();
        if (!s.member || itemIds.length === 0) return null;
        const now = new Date();
        const hour = effectiveHour(s.pretendNight, now);
        const earn = pointsFor(itemIds, hour, s.lifetimePoints);

        const bonuses: Visit["bonuses"] = [];
        const thisWeek = weekKey(now);
        let streak = s.streakWeeks;
        if (s.lastVisitWeek === null) streak = 1;
        else {
          const gap = weeksApart(s.lastVisitWeek, thisWeek);
          if (gap === 1) streak += 1;
          else if (gap > 1) streak = 1;
        }
        if (streak > 0 && streak % PROGRAM.streakWeeks === 0 && s.lastVisitWeek !== thisWeek) {
          bonuses.push({ reason: `${PROGRAM.streakWeeks} weeks running`, points: PROGRAM.streakBonusPoints });
        }

        let stamps = s.stamps + earn.stamps;
        let freeDesserts = s.freeDesserts;
        while (stamps >= PROGRAM.stampsPerReward) {
          stamps -= PROGRAM.stampsPerReward;
          freeDesserts += 1;
          bonuses.push({ reason: "10th dessert. This one is free", points: 0 });
        }

        const bonusPoints = bonuses.reduce((a, b) => a + b.points, 0);
        const visit: Visit = {
          id: uid(),
          at: now.toISOString(),
          storeId,
          itemIds,
          subtotalCents: subtotalCents(itemIds),
          points: earn.total,
          nightOwl: earn.nightOwl,
          stamps: earn.stamps,
          bonuses,
        };
        const total = earn.total + bonusPoints;
        set({
          points: s.points + total,
          lifetimePoints: s.lifetimePoints + total,
          stamps,
          freeDesserts,
          streakWeeks: streak,
          lastVisitWeek: thisWeek,
          ledger: [{ kind: "visit", visit }, ...s.ledger],
          lastEarn: { points: total, nightOwl: earn.nightOwl, at: visit.at },
        });
        return visit;
      },

      redeem: (rewardId) => {
        const s = get();
        const reward = rewardById(rewardId);
        if (!s.member || !reward || s.points < reward.cost) return null;
        const at = new Date();
        const redemption: Redemption = {
          id: uid(),
          rewardId,
          at: at.toISOString(),
          code: makeCode(reward.name),
          expiresAt: new Date(at.getTime() + PROGRAM.voucherMinutes * 60000).toISOString(),
          usedAt: null,
        };
        set({
          points: s.points - reward.cost,
          ledger: [{ kind: "redeem", redemption }, ...s.ledger],
        });
        return redemption;
      },

      markUsed: (id) =>
        set((s) => ({
          ledger: s.ledger.map((e) =>
            e.kind === "redeem" && e.redemption.id === id
              ? { ...e, redemption: { ...e.redemption, usedAt: new Date().toISOString() } }
              : e,
          ),
        })),

      setPretendNight: (v) => set({ pretendNight: v }),
      clearLastEarn: () => set({ lastEarn: null }),
      reset: () => set({ ...initial }),
    }),
    {
      name: "crave-club",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        member: s.member,
        points: s.points,
        lifetimePoints: s.lifetimePoints,
        stamps: s.stamps,
        freeDesserts: s.freeDesserts,
        streakWeeks: s.streakWeeks,
        lastVisitWeek: s.lastVisitWeek,
        ledger: s.ledger,
        pretendNight: s.pretendNight,
      }),
    },
  ),
);


export const useTier = () => useClub((s) => tierFor(s.lifetimePoints));
