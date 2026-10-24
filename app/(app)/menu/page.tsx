import type { Metadata } from "next";
import { MenuScreen } from "@/components/screens/menu";

export const metadata: Metadata = { title: "Menu" };

export default function Page() {
  return <MenuScreen />;
}
