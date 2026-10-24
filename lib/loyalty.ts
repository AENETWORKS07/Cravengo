import { MENU, menuById } from "./menu";

/**
 * The whole program on one page. If it cannot be explained on a poster at
 * the counter it is too complicated, so every rule here is one sentence.
 */
export const PROGRAM = {
  name: "Crave Club",
  /** Points per whole dollar spent. */
  pointsPerDollar: 10,
  /** Desserts (not drinks) per free dessert. */
  stampsPerReward: 10,
  /** Night Owl window: from this hour (24h, Melbourne) until close, points are doubled. */
  nightOwlFromHour: 22,
  nightOwlMultiplier: 2,
  /** Consecutive weeks of visits that earn the streak bonus. */
  streakWeeks: 4,
  streakBonusPoints: 500,
  welcomePoints: 100,
  referralPoints: 250,
  /** Redemption vouchers expire after this many minutes once revealed. */
  voucherMinutes: 15,
  rules: [
    "Earn 10 points for every $1.",
    "After 10pm every point is doubled. That is Night Owl.",
    "Every 10th dessert is free. Drinks keep the points, desserts earn the stamp too.",
    "Come in four weeks running and bank 500 bonus points.",
    "Your birthday month, a Dubai cup is on us.",
    "Bring a friend. You both get 250 points on their first order.",
  ],
} as const;

export type TierId = "sweet" | "owl" | "legend" | "icon";

export type Tier = {
  id: TierId;
  name: string;
  /** Lifetime points to reach the tier. */
  threshold: number;
  multiplier: number;
  perks: string[];
  hue: [string, string];
};

export const TIERS: Tier[] = [
  {
    id: "sweet",
    name: "Sweet Tooth",
    threshold: 0,
    multiplier: 1,
    perks: ["10 points per $1", "Night Owl double points", "Every 10th dessert free"],
    hue: ["#ff3d81", "#7b2cbf"],
  },
  {
    id: "owl",
    name: "Night Owl",
    threshold: 2500,
    multiplier: 1.1,
    perks: ["10% bonus points on everything", "Early access to drops", "Birthday Dubai cup"],
    hue: ["#7b2cbf", "#2d1b69"],
  },
  {
    id: "legend",
    name: "Legend",
    threshold: 7500,
    multiplier: 1.25,
    perks: ["25% bonus points", "Skip-the-line pass every month", "Name on the Legends wall"],
    hue: ["#ffc857", "#ff6a3d"],
  },
  {
    id: "icon",
    name: "Icon",
    threshold: 20000,
    multiplier: 1.5,
    perks: ["50% bonus points", "A menu item named for you", "Truck night invite"],
    hue: ["#9be15d", "#00c9a7"],
  },
];

export function tierFor(lifetimePoints: number): Tier {
  let current = TIERS[0];
  for (const t of TIERS) if (lifetimePoints >= t.threshold) current = t;
  return current;
}

export function nextTier(lifetimePoints: number): Tier | null {
  return TIERS.find((t) => t.threshold > lifetimePoints) ?? null;
}

export type Reward = {
  id: string;
  name: string;
  cost: number;
  blurb: string;
  emoji: string;
  hue: [string, string];
  kind: "item" | "perk";
  minTier?: TierId;
};

export const REWARDS: Reward[] = [
  { id: "topping", name: "Extra topping", cost: 300, blurb: "Any topping on any dessert.", emoji: "✨", hue: ["#ff3d81", "#ff8a80"], kind: "item" },
  { id: "juice", name: "Free signature juice", cost: 900, blurb: "Sugarcane, orange or watermelon.", emoji: "🎋", hue: ["#33691e", "#aed581"], kind: "item" },
  { id: "stick", name: "Free cheesecake stick", cost: 1500, blurb: "Pistachio, Biscoff or Bueno.", emoji: "🍰", hue: ["#1b5e20", "#9ccc65"], kind: "item" },
  { id: "acai", name: "Free Açaí Bowl", cost: 1700, blurb: "The original.", emoji: "🫐", hue: ["#5b1a6b", "#b32d7a"], kind: "item" },
  { id: "dubai", name: "Free Dubai Strawberry Cup", cost: 1800, blurb: "The viral one.", emoji: "🍓", hue: ["#2e7d32", "#c62828"], kind: "item" },
  { id: "skip", name: "Skip-the-line pass", cost: 1200, blurb: "Walk to the front of the Friday night queue. Once.", emoji: "⚡", hue: ["#ffc857", "#ff6a3d"], kind: "perk", minTier: "owl" },
  { id: "bogo", name: "Buy one, get one", cost: 2500, blurb: "Two desserts for the price of one. Bring someone.", emoji: "👯", hue: ["#7b2cbf", "#ff3d81"], kind: "perk" },
  { id: "truck", name: "Truck night ticket", cost: 6000, blurb: "A night on the Crave truck at a Melbourne night market.", emoji: "🚚", hue: ["#9be15d", "#00c9a7"], kind: "perk", minTier: "legend" },
];

export const rewardById = (id: string) => REWARDS.find((r) => r.id === id);

const DESSERT_CATEGORIES = new Set(["bowls", "cups", "waffles", "cheesecake", "more"]);

export function isDessert(itemId: string) {
  const item = menuById(itemId);
  return !!item && DESSERT_CATEGORIES.has(item.category);
}

export function subtotalCents(itemIds: string[]) {
  return itemIds.reduce((sum, id) => sum + (menuById(id)?.priceCents ?? 0), 0);
}

export type EarnBreakdown = {
  base: number;
  nightOwl: boolean;
  tierMultiplier: number;
  total: number;
  stamps: number;
};

/**
 * Points for a visit. Base points are whole dollars times the rate; Night
 * Owl doubles; the tier multiplier is applied last and rounded down so a
 * member never sees a fraction of a point.
 */
export function pointsFor(itemIds: string[], hourMelbourne: number, lifetimePoints: number): EarnBreakdown {
  const cents = subtotalCents(itemIds);
  const base = Math.floor(cents / 100) * PROGRAM.pointsPerDollar;
  const nightOwl = hourMelbourne >= PROGRAM.nightOwlFromHour || hourMelbourne < 5;
  const tier = tierFor(lifetimePoints);
  const afterOwl = nightOwl ? base * PROGRAM.nightOwlMultiplier : base;
  const total = Math.floor(afterOwl * tier.multiplier);
  const stamps = itemIds.filter(isDessert).length;
  return { base, nightOwl, tierMultiplier: tier.multiplier, total, stamps };
}

/** ISO-ish week key, Monday based, so "four weeks running" has a clear meaning. */
export function weekKey(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return d.getUTCFullYear() * 100 + week;
}

export function weeksApart(a: number, b: number) {
  const ya = Math.floor(a / 100), wa = a % 100;
  const yb = Math.floor(b / 100), wb = b % 100;
  return (yb - ya) * 52 + (wb - wa);
}

export function formatPoints(n: number) {
  return new Intl.NumberFormat("en-AU").format(n);
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

export const AVERAGE_TICKET_CENTS = Math.round(
  MENU.filter((m) => m.category !== "juices").reduce((s, m) => s + m.priceCents, 0) / MENU.filter((m) => m.category !== "juices").length,
);
