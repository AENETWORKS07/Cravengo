"use client";

import { useSyncExternalStore } from "react";
import { melbourneNow } from "@/lib/locations";

type Clock = ReturnType<typeof melbourneNow>;

/*
 * A tiny external store for "what time is it in Melbourne". Reading the clock
 * straight in render is unstable under prerendering, so the server snapshot
 * is a fixed midday Monday and the real time arrives on the client via the
 * store, re-read every 30 seconds.
 */
const SERVER: Clock = { minutes: 12 * 60, weekday: 1, hour: 12 };
let current: Clock | null = null;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function read() {
  current = melbourneNow();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (!timer) timer = setInterval(read, 30000);
  return () => {
    listeners.delete(l);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  if (!current) current = melbourneNow();
  return current;
}

export function useMelbourneClock() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
}
