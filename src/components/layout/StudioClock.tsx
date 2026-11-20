"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { useSiteContact } from "./SiteContactProvider";

/*
 * Live studio status for the footer: the current time in Coimbatore, whether
 * the studio is open, and a 24-hour bar with business hours marked in red.
 * Everything derives from the opening hours set in the admin panel (Contact details).
 */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MINUTES = 24 * 60;

const toMinutes = (hhmm: string) => {
  const [h, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "Mon-Sat" or "Mon-Fri,Sat" -> weekday indexes (Sun = 0) */
export function parseDays(spec: string) {
  const index = (name: string) => DAYS.findIndex((d) => d.toLowerCase() === name.trim().slice(0, 3).toLowerCase());
  const open = new Set<number>();
  for (const part of spec.split(",")) {
    const [from, to = from] = part.split("-").map(index);
    if (from < 0 || to < 0) continue;
    for (let d = from; ; d = (d + 1) % 7) {
      open.add(d);
      if (d === to) break;
    }
  }
  return open;
}

type Hours = { days: string; start: string; end: string };
type Schedule = Hours & { openDays: Set<number>; startMin: number; endMin: number };

const toSchedule = (hours: Hours): Schedule => ({ ...hours, openDays: parseDays(hours.days), startMin: toMinutes(hours.start), endMin: toMinutes(hours.end) });

const istFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function studioTime(date: Date, s: Schedule) {
  const parts = Object.fromEntries(istFormat.formatToParts(date).map((p) => [p.type, p.value]));
  const day = DAYS.indexOf(parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const open = s.openDays.has(day) && minutes >= s.startMin && minutes < s.endMin;
  // `day`: today in IST (Sun = 0)
  return { day, hour: parts.hour, minute: parts.minute, minutes, open, note: open ? `Open until ${s.end}` : nextOpening(day, minutes, s) };
}

function nextOpening(day: number, minutes: number, s: Schedule) {
  if (s.openDays.has(day) && minutes < s.startMin) return `Opens today at ${s.start}`;
  for (let ahead = 1; ahead <= 7; ahead++) {
    const d = (day + ahead) % 7;
    if (s.openDays.has(d)) return `Opens ${ahead === 1 ? "tomorrow" : DAYS[d]} at ${s.start}`;
  }
  return "Closed";
}

const pct = (minutes: number) => `${(minutes / DAY_MINUTES) * 100}%`;

/**
 * Live studio status (IST time, open or closed, and when it next opens) from the admin-managed
 * hours. Null until mounted, so the visitor's clock never causes a hydration mismatch.
 */
export function useStudioStatus() {
  const contact = useSiteContact();
  const { days, start, end } = contact.businessHours;
  const schedule = useMemo(() => toSchedule({ days, start, end }), [days, start, end]);
  const [now, setNow] = useState<ReturnType<typeof studioTime> | null>(null);

  useEffect(() => {
    const tick = () => setNow(studioTime(new Date(), schedule));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [schedule]);

  return now;
}

export function StudioClock({ className }: { className?: string }) {
  // Rendered empty on the server and filled on mount, so the visitor's clock never causes a hydration mismatch
  const contact = useSiteContact();
  const { days, start, end } = contact.businessHours;
  const schedule = useMemo(() => toSchedule({ days, start, end }), [days, start, end]);
  const [now, setNow] = useState<ReturnType<typeof studioTime> | null>(null);

  useEffect(() => {
    const tick = () => setNow(studioTime(new Date(), schedule));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [schedule]);

  return (
    <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-[12.5px] text-muted">{contact.address.city} studio</span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
            now?.open ? "bg-accent-soft text-accent-ink" : "bg-paper text-muted-ink",
          )}
        >
          <span className="relative flex size-1.5">
            {now?.open && <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />}
            <span className={cn("relative size-1.5 rounded-full", now?.open ? "bg-accent" : "bg-line-strong")} />
          </span>
          {now ? (now.open ? "Open now" : "Closed") : "Studio"}
        </span>
      </div>

      <p className="mt-4 flex items-baseline gap-2 text-ink">
        <span className="font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
          {now ? now.hour : "--"}
          <span className="text-accent motion-safe:animate-pulse">:</span>
          {now ? now.minute : "--"}
        </span>
        <span className="font-mono text-[11px] text-muted">IST</span>
      </p>
      <p className="mt-2 min-h-5 text-[13px] text-muted-ink">{now?.note}</p>

      {/* 24-hour day: business hours in red, a marker for now */}
      <div aria-hidden className="mt-5">
        <div className="relative h-1.5 rounded-full bg-paper ring-1 ring-line">
          <span className="absolute inset-y-0 rounded-full bg-accent/80" style={{ left: pct(schedule.startMin), width: pct(schedule.endMin - schedule.startMin) }} />
          {now && (
            <span
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-soft transition-[left] duration-700"
              style={{ left: pct(now.minutes) }}
            />
          )}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </div>

      <p className="mt-4 border-t border-line pt-4 text-[12.5px] text-muted-ink">
        {days} · {start}–{end}
      </p>
    </div>
  );
}
