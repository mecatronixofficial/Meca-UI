import Image from "next/image";
import Link from "next/link";
import { site } from "../../../lib/site";

/** Centered card for sign-in, forgot-password and reset-password. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-paper px-4 py-12">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} className="h-9 w-auto" priority />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-[0.08em] text-ink">MECATRONIX</span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.28em] text-accent-ink">ADMIN PANEL</span>
          </span>
        </Link>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift sm:p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
