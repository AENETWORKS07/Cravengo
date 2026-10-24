import type { Metadata } from "next";
import { JoinScreen } from "@/components/screens/join";

export const metadata: Metadata = { title: "Join" };

export default function Page() {
  return <JoinScreen />;
}
