export type Hours = { open: string; close: string } | null;

export type Store = {
  id: string;
  name: string;
  address: string;
  suburb: string;
  /** Opening hours as HH:MM 24h local time, by weekday (0 = Sunday). null means closed. */
  hours: Hours[] | null;
  flagship?: boolean;
  comingSoon?: boolean;
  note?: string;
};

const daily = (open: string, close: string): Hours[] =>
  Array.from({ length: 7 }, () => ({ open, close }));

/** Hours per cravengo.org location pages, October 2026. */
export const STORES: Store[] = [
  {
    id: "campbellfield",
    name: "Campbellfield",
    address: "1670 Sydney Road",
    suburb: "Campbellfield VIC 3061",
    hours: daily("17:00", "01:00"),
    flagship: true,
  },
  {
    id: "carlton",
    name: "Carlton",
    address: "Level 2, 344 Lygon Street",
    suburb: "Carlton VIC 3053",
    hours: daily("15:00", "01:00"),
  },
  {
    id: "epping",
    name: "Epping",
    address: "545 High Street",
    suburb: "Epping VIC 3076",
    hours: [
      { open: "17:00", close: "00:00" },
      { open: "17:00", close: "00:00" },
      { open: "17:00", close: "00:00" },
      { open: "17:00", close: "00:00" },
      { open: "17:00", close: "00:00" },
      { open: "16:45", close: "01:00" },
      { open: "16:45", close: "01:00" },
    ],
  },
  {
    id: "roxburgh-park",
    name: "Roxburgh Park",
    address: "22 Hollywood Drive",
    suburb: "Roxburgh Park VIC 3064",
    hours: daily("17:00", "01:00"),
  },
  {
    id: "hoppers-crossing",
    name: "Hoppers Crossing",
    address: "1/3 Alexandra Avenue",
    suburb: "Hoppers Crossing VIC 3029",
    hours: daily("17:00", "01:00"),
  },
  {
    id: "caroline-springs",
    name: "Caroline Springs",
    address: "16 Panamax Road",
    suburb: "Ravenhall VIC 3023",
    hours: daily("17:00", "01:00"),
  },
  {
    id: "altona",
    name: "Altona",
    address: "Opening soon",
    suburb: "Altona VIC",
    hours: null,
    comingSoon: true,
  },
];

export const storeById = (id: string) => STORES.find((s) => s.id === id);

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Minutes since midnight and weekday in Melbourne for a given instant. */
export function melbourneNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hour = Number(get("hour")) % 24;
  return {
    minutes: hour * 60 + Number(get("minute")),
    weekday: weekdays.indexOf(get("weekday")),
    hour,
  };
}

/**
 * Open-now for a store that closes after midnight. A 17:00 to 01:00 day is
 * read as open from 17:00 until 01:00 the following morning, so at 00:30 we
 * check yesterday's hours.
 */
export function isOpenNow(store: Store, date = new Date()) {
  if (!store.hours) return false;
  const { minutes, weekday } = melbourneNow(date);
  const today = store.hours[weekday];
  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (close > open ? minutes >= open && minutes < close : minutes >= open) return true;
  }
  const yesterday = store.hours[(weekday + 6) % 7];
  if (yesterday) {
    const open = toMinutes(yesterday.open);
    const close = toMinutes(yesterday.close);
    if (close <= open && minutes < close) return true;
  }
  return false;
}

export function hoursLabel(store: Store, weekday: number) {
  if (!store.hours) return "Opening soon";
  const h = store.hours[weekday];
  if (!h) return "Closed";
  const fmt = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    const suffix = hh >= 12 && hh < 24 ? "pm" : "am";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return mm ? `${h12}:${String(mm).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
  };
  return `${fmt(h.open)} – ${fmt(h.close)}`;
}
