"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { cn } from "../../lib/cn";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi, I'm MECA — the Mecatronix assistant. Ask me about our services, how we work, or how to start a project.",
};

const SUGGESTIONS = ["What services do you offer?", "Can you build an ERP for my factory?", "How do projects work?"];

/** Turns site paths in replies (e.g. /work) into links. */
function renderWithLinks(text: string) {
  const parts = text.split(/(\/(?:services(?:\/[a-z-]+)?|work|contact|process|industries|about|insights)\b)/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} className="font-medium text-accent-ink underline underline-offset-2">
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

export default function MecaPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/meca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is UI-only; the API expects the conversation to start with the user
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      const reply =
        data.reply ??
        (res.status === 503
          ? "I'm offline right now. You can reach the team directly on /contact."
          : data.error ?? "Something went wrong. Please try again, or reach us on /contact.");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't connect. Please check your connection or reach us on /contact." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      id="meca-panel"
      role="dialog"
      aria-label="Chat with MECA, the Mecatronix assistant"
      hidden={!open}
      className="fixed inset-x-3 bottom-20 z-40 flex max-h-[min(560px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white text-ink shadow-window sm:inset-x-auto sm:bottom-22 sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="font-display text-[15px] font-semibold">MECA</p>
          <p className="text-xs text-muted">AI assistant · replies may be imperfect</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-ink">
          <X aria-hidden className="size-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
              m.role === "user" ? "ml-auto bg-accent-strong text-white" : "bg-paper text-surface",
            )}
          >
            {m.role === "assistant" ? renderWithLinks(m.content) : m.content}
          </div>
        ))}
        {busy && (
          <div className="flex w-fit gap-1 rounded-2xl bg-paper px-4 py-3" aria-label="MECA is typing">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-surface/80 transition-colors hover:border-accent hover:text-accent-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-line p-3"
      >
        <label htmlFor="meca-input" className="sr-only">Message</label>
        <textarea
          id="meca-input"
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={2000}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask about your project…"
          className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line-strong bg-paper px-3.5 py-2.5 text-[16px] text-ink placeholder:text-muted focus:border-accent focus:bg-white focus:outline-none sm:text-[14px]"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-strong text-white transition-opacity disabled:opacity-40"
        >
          <ArrowUp aria-hidden className="size-4" />
        </button>
      </form>
    </div>
  );
}
