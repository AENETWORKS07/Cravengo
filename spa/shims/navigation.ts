import { useMemo } from "react";
import { useNav } from "./nav-store";

export function useRouter() {
  const navigate = useNav((s) => s.navigate);
  return useMemo(() => ({ push: (h: string) => navigate(h), replace: (h: string) => navigate(h, true), back: () => navigate("/") }), [navigate]);
}

export function usePathname() {
  return useNav((s) => s.path);
}

export function useSearchParams() {
  const search = useNav((s) => s.search);
  return useMemo(() => new URLSearchParams(search), [search]);
}
