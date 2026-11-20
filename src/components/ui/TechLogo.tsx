import { CloudCog, Code2, Webhook } from "lucide-react";
import { brandLogoFor } from "./brand-logos";

/**
 * A technology's official logo in its brand colour (src/components/ui/brand-logos.ts), drawn at
 * one fixed size so every logo in a list matches. Names without a logo (e.g. "REST APIs",
 * "Managed cloud hosting") get a neutral icon rather than someone else's brand.
 */
export function TechLogo({ name, size = 14, className }: { name: string; size?: number; className?: string }) {
  const logo = brandLogoFor(name);
  if (logo) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={`#${logo.hex}`} aria-hidden focusable="false" className={className} style={{ flexShrink: 0 }}>
        <path d={logo.path} />
      </svg>
    );
  }
  const Icon = /api|rest|graphql|webhook/i.test(name) ? Webhook : /cloud|host|server|deploy/i.test(name) ? CloudCog : Code2;
  return <Icon aria-hidden width={size} height={size} strokeWidth={2} className={className} style={{ flexShrink: 0, color: "var(--color-muted-ink)" }} />;
}
