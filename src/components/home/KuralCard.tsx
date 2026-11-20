"use client";

import { useState, type CSSProperties } from "react";
import type { KuralOfTheDay } from "../../lib/content";
import { cn } from "../../lib/cn";

/** Tamil script fonts every platform already has (no download): Windows, Apple, Android/Linux. */
export const tamilFont: CSSProperties = {
  fontFamily: '"Nirmala UI", "Latha", "Tamil Sangam MN", "Tamil MN", "Noto Sans Tamil", "Noto Serif Tamil", sans-serif',
};

const TABS = [
  { id: "tamil", label: "தமிழ்", hint: "Kural" },
  { id: "english", label: "English", hint: "Translation" },
  { id: "meaning", label: "பொருள்", hint: "Meaning" },
  { id: "urai", label: "உரை", hint: "Commentary" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const URAI = [
  { id: "mv", name: "மு. வரதராசனார்" },
  { id: "mk", name: "கலைஞர் மு. கருணாநிதி" },
  { id: "sp", name: "சாலமன் பாப்பையா" },
] as const;
type Urai = (typeof URAI)[number]["id"];

/** Interactive part of the kural card: the Tamil couplet, its translation, meaning and commentaries. */
export function KuralCard({ kural }: { kural: KuralOfTheDay }) {
  const [tab, setTab] = useState<Tab>("tamil");
  const [urai, setUrai] = useState<Urai>("mv");

  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label="Kural views" className="grid grid-cols-4 gap-1 rounded-xl bg-paper p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls="kural-panel"
            onClick={() => setTab(t.id)}
            className={cn(
              "min-w-0 rounded-lg px-1 py-1.5 text-[12.5px] font-semibold transition-[color,background-color,box-shadow,translate] duration-300 sm:px-2.5 sm:text-[13px]",
              tab === t.id ? "bg-white text-accent-ink shadow-soft" : "text-muted-ink hover:-translate-y-px hover:bg-white/60 hover:text-ink",
            )}
          >
            <span style={tamilFont}>{t.label}</span>
            <span className="ml-1.5 hidden text-[11px] font-medium text-muted sm:inline">{t.hint}</span>
          </button>
        ))}
      </div>

      <div id="kural-panel" role="tabpanel" key={tab + urai} className="flex min-h-[124px] flex-1 flex-col justify-center py-4 motion-safe:animate-fade">
        {tab === "tamil" && (
          <div>
            <p lang="ta" style={tamilFont} className="text-[clamp(1.15rem,0.95rem+1vw,1.6rem)] font-semibold leading-[1.7] text-ink">
              <span className="block motion-safe:animate-rise">{kural.lines[0]}</span>
              <span className="block text-accent-ink motion-safe:animate-rise" style={{ animationDelay: "120ms" }}>
                {kural.lines[1]}
              </span>
            </p>
            <p className="mt-2.5 text-[13px] italic leading-relaxed text-muted-ink">
              {kural.transliteration[0]}
              <br />
              {kural.transliteration[1]}
            </p>
          </div>
        )}

        {tab === "english" && (
          <blockquote className="font-display text-[clamp(1.1rem,0.95rem+0.8vw,1.4rem)] font-medium leading-snug tracking-tight text-ink">
            <span aria-hidden className="mr-1 text-accent">&ldquo;</span>
            {kural.translation}
            <span aria-hidden className="ml-1 text-accent">&rdquo;</span>
          </blockquote>
        )}

        {tab === "meaning" && <p className="text-[15px] leading-relaxed text-surface sm:text-[16px]">{kural.explanation}</p>}

        {tab === "urai" && (
          <div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Commentator">
              {URAI.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrai(u.id)}
                  aria-pressed={urai === u.id}
                  style={tamilFont}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    urai === u.id ? "border-accent bg-accent-soft text-accent-ink" : "border-line text-muted-ink hover:border-line-strong hover:text-ink",
                  )}
                >
                  {u.name}
                </button>
              ))}
            </div>
            <p lang="ta" style={tamilFont} className="mt-3 text-[15px] leading-[1.85] text-surface sm:text-[16px]">
              {kural.urai[urai]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
