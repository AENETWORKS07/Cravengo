"use client";

import { PROGRAM } from "@/lib/loyalty";
import { useClub } from "@/lib/store";
import { useMelbourneClock } from "./use-clock";

/** Live Night Owl status with the demo override applied. */
export function useNight() {
  const pretend = useClub((s) => s.pretendNight);
  const now = useMelbourneClock();
  const realNight = now.hour >= PROGRAM.nightOwlFromHour || now.hour < 5;
  const night = pretend || realNight;
  const minutesUntil = realNight ? 0 : PROGRAM.nightOwlFromHour * 60 - now.minutes;
  return { night, realNight, pretend, hour: pretend ? 23 : now.hour, minutesUntil };
}
