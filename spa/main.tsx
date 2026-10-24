import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "@/components/shell";
import { HomeScreen } from "@/components/screens/home";
import { JoinScreen } from "@/components/screens/join";
import { MenuScreen } from "@/components/screens/menu";
import { EarnScreen } from "@/components/screens/earn";
import { RewardsScreen } from "@/components/screens/rewards";
import { LocationsScreen } from "@/components/screens/locations";
import { AccountScreen } from "@/components/screens/account";
import { PitchDeck } from "@/components/pitch-deck";
import { OwnerView } from "@/components/owner-view";
import { useNav } from "./shims/nav-store";

const SCREENS: Record<string, () => React.ReactElement> = {
  "/": HomeScreen,
  "/join": JoinScreen,
  "/menu": MenuScreen,
  "/earn": () => (
    <Suspense fallback={null}>
      <EarnScreen />
    </Suspense>
  ),
  "/rewards": RewardsScreen,
  "/locations": LocationsScreen,
  "/account": AccountScreen,
};

function App() {
  const path = useNav((s) => s.path);
  if (path === "/pitch") return <PitchDeck />;
  if (path === "/owner") return <OwnerView />;
  const Screen = SCREENS[path] ?? HomeScreen;
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}

createRoot(document.getElementById("crave-root")!).render(<App />);
