"use client";

import { CircleCheck, CircleX, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui";

/** Toasts and confirm dialogs for the whole admin panel. */

interface Toast {
  id: number;
  tone: "success" | "error";
  message: string;
}

interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "primary";
}

interface FeedbackContext {
  toast: { success: (message: string) => void; error: (message: string) => void };
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const Context = createContext<FeedbackContext | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (tone: Toast["tone"], message: string) => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-3), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === "error" ? 7000 : 4000);
    },
    [dismiss],
  );

  const value = useMemo<FeedbackContext>(
    () => ({
      toast: { success: (m) => push("success", m), error: (m) => push("error", m) },
      confirm: (options) => new Promise<boolean>((resolve) => setDialog({ ...options, resolve })),
    }),
    [push],
  );

  const settle = (ok: boolean) => {
    dialog?.resolve(ok);
    setDialog(null);
  };

  return (
    <Context.Provider value={value}>
      {children}

      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 left-4 z-[100] flex flex-col items-end gap-2 sm:left-auto">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm animate-rise items-start [animation-duration:250ms] gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lift"
          >
            {t.tone === "success" ? <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-[#47cd89]" /> : <CircleX aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-glow" />}
            <span className="min-w-0 flex-1">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={!!dialog}
        onClose={() => settle(false)}
        title={dialog?.title ?? ""}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => settle(false)}>
              Cancel
            </Button>
            <Button variant={dialog?.tone === "primary" ? "primary" : "danger"} onClick={() => settle(true)}>
              {dialog?.confirmLabel ?? "Delete"}
            </Button>
          </>
        }
      >
        <div className="text-sm leading-relaxed text-muted-ink">{dialog?.message}</div>
      </Modal>
    </Context.Provider>
  );
}

export function useFeedback() {
  const context = useContext(Context);
  if (!context) throw new Error("useFeedback must be used inside FeedbackProvider");
  return context;
}
