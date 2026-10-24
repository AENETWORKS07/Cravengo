import type { Metadata } from "next";
import { RewardsScreen } from "@/components/screens/rewards";

export const metadata: Metadata = { title: "Rewards" };

export default function Page() {
  return <RewardsScreen />;
}
