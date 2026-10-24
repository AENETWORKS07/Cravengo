"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { House, ForkKnife, QrCode, Gift, MapPin } from "@phosphor-icons/react";
import { cx } from "./ui";
import { BRAND } from "@/lib/brand";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/menu", label: "Menu", Icon: ForkKnife },
  { href: "/earn", label: "Earn", Icon: QrCode, primary: true },
  { href: "/rewards", label: "Rewards", Icon: Gift },
  { href: "/locations", label: "Stores", Icon: MapPin },
] as const;

/**
 * Phone-first shell. On a phone it is the whole screen. On a laptop, which is
 * where this gets pitched, the app sits inside a phone frame on a stage with
 * the pitch links beside it, so the person presenting never has to shrink a
 * browser window to make it look right.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="stage min-h-dvh lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10 lg:py-10">
      <aside className="hidden lg:flex flex-col items-end text-right pr-4">
        <p className="font-display text-4xl font-extrabold leading-none">{BRAND.appName}</p>
        <p className="mt-2 text-muted max-w-xs">The {BRAND.name} loyalty app. Earn on every dessert, double after 10pm, every 10th dessert free.</p>
        <div className="mt-6 flex flex-col gap-2 items-end">
          <Link href="/pitch" className="text-pink-soft hover:text-pink font-semibold">Open the pitch →</Link>
          <Link href="/owner" className="text-pink-soft hover:text-pink font-semibold">Owner view →</Link>
        </div>
      </aside>

      <div className="relative mx-auto w-full max-w-[430px] lg:rounded-[48px] lg:border-[10px] lg:border-[#1a1326] lg:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] lg:overflow-hidden lg:h-[860px] bg-ground flex flex-col">
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 rounded-b-2xl bg-[#1a1326] z-20" />
        <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-[max(20px,env(safe-area-inset-top))] pb-28 lg:pt-12">{children}</main>

        <nav
          className="absolute bottom-0 inset-x-0 z-30 border-t border-line bg-ground/85 backdrop-blur-xl pb-[max(10px,env(safe-area-inset-bottom))] pt-2"
          aria-label="Primary"
        >
          <ul className="grid grid-cols-5 items-end px-2">
            {TABS.map(({ href, label, Icon, ...t }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              const primary = "primary" in t && t.primary;
              return (
                <li key={href} className="flex justify-center">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {primary ? (
                      <span className="pulse-ring relative -mt-7 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-pink to-acai text-white shadow-[0_10px_30px_-8px_rgba(255,61,129,0.9)]">
                        <Icon size={26} weight="bold" />
                      </span>
                    ) : (
                      <Icon size={22} weight={active ? "fill" : "regular"} />
                    )}
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <aside className="hidden lg:block pl-4 text-muted text-sm max-w-xs">
        <p className="font-semibold text-ink">Try it live</p>
        <ol className="mt-2 list-decimal pl-4 space-y-1">
          <li>Join with a name.</li>
          <li>Tap Earn, then Demo a visit, and pick a bowl.</li>
          <li>Flip the Night Owl switch to see points double.</li>
          <li>Redeem a reward and show the voucher.</li>
        </ol>
      </aside>
    </div>
  );
}
