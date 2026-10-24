"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True once on the client, false during server render and hydration. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
