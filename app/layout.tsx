import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.appName} · ${BRAND.name}`,
    template: `%s · ${BRAND.appName}`,
  },
  description: `The ${BRAND.name} loyalty app. Earn points on every dessert, double after 10pm, every 10th dessert free.`,
  applicationName: BRAND.appName,
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: BRAND.appName },
  formatDetection: { telephone: false },
  /* Pitch build. Nothing here should be indexed until the business launches it. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0712",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
