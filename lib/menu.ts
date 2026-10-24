export type Category = "bowls" | "cups" | "waffles" | "cheesecake" | "juices" | "more";

export type MenuItem = {
  id: string;
  name: string;
  category: Category;
  /** Price in whole cents. Delivery listing prices, lowest seen across stores. */
  priceCents: number;
  blurb: string;
  /** Gradient stops used in place of a photograph. */
  hue: [string, string];
  emoji: string;
  tags?: ("signature" | "viral" | "new" | "vegan")[];
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "bowls", label: "Açaí bowls" },
  { id: "cups", label: "Cups" },
  { id: "waffles", label: "Waffles" },
  { id: "cheesecake", label: "Cheesecake" },
  { id: "juices", label: "Juices" },
  { id: "more", label: "More" },
];

export const MENU: MenuItem[] = [
  {
    id: "acai",
    name: "Açaí Bowl",
    category: "bowls",
    priceCents: 1750,
    blurb: "The one that started it all. Thick açaí base, granola, banana, strawberry, coconut.",
    hue: ["#5b1a6b", "#b32d7a"],
    emoji: "🫐",
    tags: ["signature", "vegan"],
  },
  {
    id: "crave-cup",
    name: "Crave Cup",
    category: "cups",
    priceCents: 2000,
    blurb: "Half strawberry cup, half açaí. For people who refuse to choose.",
    hue: ["#c2185b", "#6a1b9a"],
    emoji: "🍓",
    tags: ["signature"],
  },
  {
    id: "dubai-cup",
    name: "Viral Dubai Strawberry Cup",
    category: "cups",
    priceCents: 1795,
    blurb: "Fresh strawberries layered with Nutella, creamy pistachio and crispy kadayif.",
    hue: ["#2e7d32", "#c62828"],
    emoji: "🥧",
    tags: ["viral"],
  },
  {
    id: "strawberry-cup",
    name: "Strawberry Cup",
    category: "cups",
    priceCents: 1595,
    blurb: "Juicy strawberries, your choice of sauce, finished with cream.",
    hue: ["#e53935", "#ff8a80"],
    emoji: "🍓",
  },
  {
    id: "loaded-waffles",
    name: "Loaded Waffles",
    category: "waffles",
    priceCents: 1750,
    blurb: "Hot Belgian waffles buried under sauce, fruit, ice cream and crunch.",
    hue: ["#8d4a12", "#f5a623"],
    emoji: "🧇",
    tags: ["signature"],
  },
  {
    id: "dutch-pancakes",
    name: "Dutch Pancakes · 20 pack",
    category: "waffles",
    priceCents: 1495,
    blurb: "Twenty mini pancakes, sauced and dusted.",
    hue: ["#6d4c41", "#ffb74d"],
    emoji: "🥞",
  },
  {
    id: "crepe-supreme",
    name: "Crepe Supreme",
    category: "waffles",
    priceCents: 1695,
    blurb: "Folded crepe, loaded the Crave way.",
    hue: ["#4e342e", "#d7a86e"],
    emoji: "🥞",
  },
  {
    id: "cheesecake-pistachio",
    name: "Pistachio Paradise Stick",
    category: "cheesecake",
    priceCents: 1695,
    blurb: "Cheesecake on a stick, dipped in pistachio.",
    hue: ["#1b5e20", "#9ccc65"],
    emoji: "🍰",
    tags: ["viral"],
  },
  {
    id: "cheesecake-biscoff",
    name: "Biscoff Stick",
    category: "cheesecake",
    priceCents: 1695,
    blurb: "Cheesecake stick coated in Biscoff spread and crumb.",
    hue: ["#795548", "#d4a373"],
    emoji: "🍰",
  },
  {
    id: "cheesecake-bueno",
    name: "Bueno Surprise Stick",
    category: "cheesecake",
    priceCents: 1695,
    blurb: "Cheesecake stick with hazelnut cream and Bueno.",
    hue: ["#3e2723", "#bcaaa4"],
    emoji: "🍫",
  },
  {
    id: "san-sebastian",
    name: "San Sebastián Cheesecake",
    category: "cheesecake",
    priceCents: 1495,
    blurb: "Burnt-top Basque cheesecake, soft centre.",
    hue: ["#4a2c0a", "#e0b76a"],
    emoji: "🍮",
  },
  {
    id: "sugarcane",
    name: "Straight Sugarcane",
    category: "juices",
    priceCents: 995,
    blurb: "Pressed to order. Nothing added.",
    hue: ["#33691e", "#aed581"],
    emoji: "🎋",
    tags: ["signature", "vegan"],
  },
  {
    id: "orange",
    name: "Fresh Orange Juice",
    category: "juices",
    priceCents: 989,
    blurb: "Squeezed while you wait.",
    hue: ["#e65100", "#ffb300"],
    emoji: "🍊",
    tags: ["vegan"],
  },
  {
    id: "watermelon",
    name: "Watermelon Juice",
    category: "juices",
    priceCents: 989,
    blurb: "Cold, sweet, gone in a minute.",
    hue: ["#c62828", "#66bb6a"],
    emoji: "🍉",
    tags: ["vegan"],
  },
  {
    id: "crave-shake",
    name: "Crave Shake",
    category: "juices",
    priceCents: 1295,
    blurb: "Thick shake in the house flavours.",
    hue: ["#4a148c", "#ce93d8"],
    emoji: "🥤",
  },
  {
    id: "cookie-dough",
    name: "Scoopable Cookie Dough",
    category: "more",
    priceCents: 1395,
    blurb: "Edible cookie dough by the scoop.",
    hue: ["#5d4037", "#ffcc80"],
    emoji: "🍪",
  },
];

export const menuById = (id: string) => MENU.find((m) => m.id === id);
