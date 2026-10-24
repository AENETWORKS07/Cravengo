# Crave Club

The loyalty app for [Crave 'N' Go](https://cravengo.org), Melbourne's late-night dessert chain. Built to be pitched: it runs on a phone, installs from the browser, and on a laptop it sits inside a phone frame with the pitch deck and the owner's model one click away.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Next.js 16 (Cache Components), React 19, Tailwind v4, TypeScript, zustand. No backend: every member action is stored on the device, which is enough to pitch and nothing more.

## The program

Three rules that fit on a poster, with the rest underneath for people who want more. All of it lives in `lib/loyalty.ts`.

1. 10 points for every $1.
2. After 10pm every point is doubled. That is Night Owl.
3. Every 10th dessert is free.

Underneath: four tiers with multipliers (Sweet Tooth, Night Owl, Legend, Icon), a four-week visit streak bonus, a birthday Dubai cup, referrals, and vouchers that expire 15 minutes after they are revealed so they get used at the counter.

## Routes

| Route | What it is |
|---|---|
| `/` | Welcome, or the member's home: card with QR, live Night Owl countdown, stamp card, streak, next reward, activity. |
| `/join` | Twenty-second sign-up. Only a name is required. |
| `/menu` | The menu with what each item earns. Items can be added to a demo visit. |
| `/earn` | The QR to show at the counter, and **Demo a visit**: pick a store and items, flip the 11pm switch, watch the points land. |
| `/rewards` | Catalogue, redemption, QR vouchers with a countdown, the staff "mark as used" step. |
| `/locations` | All seven stores with open-now computed in Melbourne time, including the after-midnight closes. |
| `/account` | Tiers, referral code, full history, program rules, pitch-build assumptions, reset. |
| `/pitch` | Seven-slide deck. Arrow keys or swipe. Links into the live app. |
| `/owner` | The model. Sliders for scan rate, repeat uplift, stores, ticket, redemption and food cost. Nothing on it is live data. |

## What is real and what is not

Facts about the business come from cravengo.org and the public delivery listings as of October 2026 and are kept in `lib/brand.ts`, `lib/menu.ts` and `lib/locations.ts`. Where something could not be confirmed it is written down as an assumption in `ASSUMPTIONS` and shown on the Account screen.

- Menu items and prices are from the delivery listings, which differ by store. The lowest seen is used.
- Trading hours are from the location pages on cravengo.org.
- Brand colours are a proposal. The site itself could not be fetched from the build environment, so the palette was chosen for the product (açaí purple, strawberry pink, pistachio) and should be swapped for the real brand tokens in `app/globals.css`.
- Social handles are a guess.
- The Owner view is arithmetic on sliders. Only the average ticket is sourced; everything else is a placeholder for till data.
- Member data never leaves the phone. There is no account system, no scanner integration, no payments.

## Before launch

- Replace on-device state with an API and a staff scanner app (the QR payloads are already `cravengo:member:<id>` and `cravengo:voucher:<code>`).
- Decide the real earn rate, Night Owl window and tier thresholds with the tills in front of you.
- Confirm hours, socials and brand colours with the business.
- Remove `robots: noindex` in `app/layout.tsx` when it goes live.
