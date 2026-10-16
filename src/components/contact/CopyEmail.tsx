"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "../../app/contact/contact.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 3000);
  }

  return (
    <div className={styles.copyWrap}>
      <button type="button" className={styles.copyButton} onClick={copy} aria-label={state === "copied" ? "Email address copied" : "Copy email address"}>
        {state === "copied" ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className={styles.copyStatus}>{state === "error" ? "Couldn’t copy. Use the email link above." : state === "copied" ? "Ready to paste." : ""}</span>
    </div>
  );
}
