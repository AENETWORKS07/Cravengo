import type { Metadata } from "next";
import { OwnerView } from "@/components/owner-view";

export const metadata: Metadata = { title: "Owner view" };

export default function Page() {
  return <OwnerView />;
}
