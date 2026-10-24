import type { Metadata } from "next";
import { LocationsScreen } from "@/components/screens/locations";

export const metadata: Metadata = { title: "Stores" };

export default function Page() {
  return <LocationsScreen />;
}
