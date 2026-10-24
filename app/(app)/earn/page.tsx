import type { Metadata } from "next";
import { Suspense } from "react";
import { EarnScreen } from "@/components/screens/earn";

export const metadata: Metadata = { title: "Earn" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60dvh]" aria-busy />}>
      <EarnScreen />
    </Suspense>
  );
}
