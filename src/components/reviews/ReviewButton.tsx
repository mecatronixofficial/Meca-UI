"use client";

import { PenLine } from "lucide-react";
import { cn } from "../../lib/cn";
import { OPEN_REVIEW_EVENT } from "./ReviewModal";

/** Opens the "Write a review" dialog (ReviewModal, mounted in the layout). */
export function ReviewButton({ className, variant = "outline", children = "Write a review" }: { className?: string; variant?: "outline" | "solid"; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_REVIEW_EVENT))}
      className={cn(
        "group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-[background-color,color,border-color,translate] duration-300 hover:-translate-y-0.5",
        variant === "solid" ? "bg-accent-strong text-white shadow-glow hover:bg-accent-ink" : "border border-line-strong bg-white text-ink hover:border-accent hover:text-accent-ink",
        className,
      )}
    >
      <PenLine aria-hidden className="size-4 transition-transform group-hover:-rotate-12" />
      {children}
    </button>
  );
}
