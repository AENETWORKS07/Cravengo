/**
 * Everything the app says about the business lives here.
 *
 * Rule: a fact is either sourced or it is marked as an assumption. The
 * sourced facts come from cravengo.org and the public delivery listings
 * (DoorDash, Uber Eats, What's On Melbourne) as of October 2026. Anything
 * the business has not confirmed is flagged so it can be swapped out before
 * this goes in front of a customer.
 */

export const BRAND = {
  name: "Crave 'N' Go",
  shortName: "Crave 'N' Go",
  appName: "Crave Club",
  url: "https://cravengo.org",
  tagline: "Late-night desserts, Melbourne.",
  /** From the business's own site. */
  positioning: "Açaí bowls, viral Dubai cups, loaded waffles, cheesecake sticks and signature juices. Open late, every night.",
  /** From the company's about copy: started as a single dessert truck serving Melbourne's first açaí bowls. */
  origin:
    "Started as a single dessert food truck serving Melbourne's first açaí bowls. Now seven stores across Melbourne and a truck that still rolls through the city's night markets.",
  ambition: "On the way to becoming the world's first fast dessert chain.",
  city: "Melbourne",
  timeZone: "Australia/Melbourne",
  currency: "AUD",
  socials: {
    tiktok: "https://www.tiktok.com/@cravengo",
    instagram: "https://www.instagram.com/cravengo",
    facebook: "https://www.facebook.com/CraveNGo/",
  },
} as const;

/** Assumptions the pitch is built on. Shown in the app so nobody mistakes them for facts. */
export const ASSUMPTIONS = [
  "Menu prices are taken from the delivery listings, which differ by store. In-store prices may be lower.",
  "Trading hours come from cravengo.org's location pages and may change.",
  "Member numbers, revenue figures and the activity feed in Owner view are a model, not live data.",
  "Social handles are a best guess and must be confirmed before launch.",
];
