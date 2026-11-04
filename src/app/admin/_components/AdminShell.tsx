"use client";

import {
  BadgePercent,
  FileText,
  FolderKanban,
  GalleryHorizontalEnd,
  Handshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Receipt,
  ShieldCheck,
  UserRound,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { site } from "../../../lib/site";
import { api, UNAUTHORIZED_EVENT } from "../_lib/api";
import type { Admin } from "../_lib/types";
import { Avatar, Spinner } from "./ui";

interface Session {
  user: Admin;
  setUser: (user: Admin) => void;
}

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside AdminShell");
  return session;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  superadmin?: boolean;
}

const NAV: { heading: string; items: NavItem[] }[] = [
  { heading: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    heading: "Inbox",
    items: [
      { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
      { href: "/admin/subscribers", label: "Subscribers", icon: Newspaper },
    ],
  },
  {
    heading: "Website",
    items: [
      { href: "/admin/banners", label: "Banners", icon: GalleryHorizontalEnd },
      { href: "/admin/blogs", label: "Blogs", icon: FileText },
      { href: "/admin/works", label: "Works", icon: Wrench },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/clients", label: "Clients", icon: Handshake },
    ],
  },
  {
    heading: "Business",
    items: [
      { href: "/admin/invoices", label: "Invoices", icon: Receipt },
      { href: "/admin/vouchers", label: "Vouchers", icon: BadgePercent },
    ],
  },
  {
    heading: "Settings",
    items: [
      { href: "/admin/admins", label: "Admins", icon: ShieldCheck, superadmin: true },
      { href: "/admin/account", label: "My account", icon: UserRound },
    ],
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<Admin | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openedFor, setOpenedFor] = useState(pathname);

  // Close the mobile menu after navigating
  if (openedFor !== pathname) {
    setOpenedFor(pathname);
    setMenuOpen(false);
  }

  const toLogin = useCallback(() => {
    const next = window.location.pathname + window.location.search;
    router.replace(`/admin/login${next !== "/admin" ? `?next=${encodeURIComponent(next)}` : ""}`);
  }, [router]);

  useEffect(() => {
    api<Admin>("auth/check_login").then(({ data }) => setUser(data), toLogin);
    window.addEventListener(UNAUTHORIZED_EVENT, toLogin);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, toLogin);
  }, [toLogin]);

  const logout = async () => {
    await api("auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
  };

  if (!user) return <Spinner label="Checking your session" className="min-h-dvh" />;

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 pt-5 pb-6">
        <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} className="h-8 w-auto" />
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-semibold tracking-[0.08em] text-ink">MECATRONIX</span>
          <span className="mt-1 font-mono text-[9px] tracking-[0.28em] text-accent-ink">ADMIN</span>
        </span>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => {
          const items = group.items.filter((item) => !item.superadmin || user.role === "superadmin");
          if (!items.length) return null;
          return (
            <div key={group.heading} className="mb-5">
              <p className="mb-1.5 px-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{group.heading}</p>
              <ul className="flex flex-col gap-0.5">
                {items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        isActive(href) ? "bg-ink font-medium text-white" : "text-muted-ink hover:bg-paper hover:text-ink",
                      )}
                    >
                      <Icon aria-hidden className={cn("size-[18px]", isActive(href) ? "text-accent-glow" : "text-muted")} strokeWidth={1.8} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 border-t border-line p-4">
        <Avatar name={user.name} src={user.img} className="size-9" />
        <Link href="/admin/account" className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink">{user.name}</span>
          <span className="block truncate text-xs text-muted capitalize">{user.role}</span>
        </Link>
        <button type="button" onClick={logout} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-muted hover:bg-paper hover:text-accent-ink">
          <LogOut className="size-[18px]" />
        </button>
      </div>
    </nav>
  );

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      <div className="min-h-dvh bg-paper print:bg-white">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block print:hidden">{sidebar}</aside>

        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden print:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} className="h-7 w-auto" />
            <span className="font-display text-sm font-semibold tracking-[0.08em] text-ink">ADMIN</span>
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="rounded-lg p-2 text-ink hover:bg-paper">
            <Menu className="size-5" />
          </button>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} aria-hidden />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-window">
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute top-4 right-3 rounded-lg p-2 text-muted hover:bg-paper">
                <X className="size-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        {/* The root layout already provides <main> */}
        <div className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-9 print:m-0 print:p-0">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>
    </SessionContext.Provider>
  );
}
