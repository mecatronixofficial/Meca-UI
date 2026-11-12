"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

/** Footer newsletter sign-up. Subscribers are managed in the admin panel. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ status: "idle" | "busy" | "done" | "error"; message?: string }>({ status: "idle" });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honeypot = new FormData(event.currentTarget).get("company");
    setState({ status: "busy" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: honeypot || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; already?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setEmail("");
      setState({ status: "done", message: data.already ? "You're already subscribed. Thank you!" : "You're in. Watch your inbox for updates." });
    } catch (error) {
      setState({ status: "error", message: (error as Error).message });
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 max-w-sm" noValidate>
      <label htmlFor={id} className="text-label text-muted">
        Newsletter
      </label>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-ink">Occasional offers and engineering notes. No spam.</p>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-line-strong bg-white p-1 pl-4 transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state.status !== "busy") setState({ status: "idle" });
          }}
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={state.message ? `${id}-status` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
        {/* Honeypot, hidden from people */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          type="submit"
          disabled={state.status === "busy" || !email.trim()}
          aria-label="Subscribe"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-strong text-white transition-colors hover:bg-accent-ink disabled:opacity-50"
        >
          {state.status === "busy" ? <LoaderCircle className="size-4 animate-spin" /> : state.status === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      {state.message && (
        <p id={`${id}-status`} role={state.status === "error" ? "alert" : "status"} className={`mt-2.5 text-[13px] ${state.status === "error" ? "text-[#b42318]" : "text-[#067647]"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
