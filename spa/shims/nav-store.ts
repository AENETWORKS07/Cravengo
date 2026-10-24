import { create } from "zustand";

/** In-page router for the single-file demo build. The artifact viewer never shows URL changes, so routing is plain state. */
type Nav = { path: string; search: string; navigate: (href: string, replace?: boolean) => void };

const ROUTES = ["/", "/join", "/menu", "/earn", "/rewards", "/locations", "/account", "/pitch", "/owner"];

function parse(href: string) {
  const [p, q = ""] = href.split("?");
  const path = ROUTES.includes(p) ? p : "/";
  return { path, search: q };
}

function fromHash() {
  const token = typeof location !== "undefined" ? location.hash.replace(/^#/, "") : "";
  return parse(token ? `/${token}` : "/");
}

export const useNav = create<Nav>()((set) => ({
  ...fromHash(),
  navigate: (href) => {
    set(parse(href));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    document.querySelector("main")?.scrollTo({ top: 0 });
  },
}));

/* Deep links such as #pitch or #owner keep working after load. */
if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => useNav.setState(fromHash()));
}
