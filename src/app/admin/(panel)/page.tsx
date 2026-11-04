"use client";

import { ArrowRight, Mail, MessageSquareQuote, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSession } from "../_components/AdminShell";
import { Badge, Card, ErrorState, PageHeader, Spinner, Stack } from "../_components/ui";
import { useApiData } from "../_lib/api";
import { timeAgo } from "../_lib/format";
import type { DashboardStats, Enquiry, Paginated, SubscriberStats } from "../_lib/types";

const greeting = () => {
  const hour = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

/** Sign-ups over the last `days` days, from the API's per-day counts (UTC days). */
function recentSignups(stats: SubscriberStats | undefined, days: number) {
  if (!stats) return null;
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  return stats.dailyStats.filter((d) => d._id > since).reduce((sum, d) => sum + d.count, 0);
}

export default function DashboardPage() {
  const { user } = useSession();
  const stats = useApiData<DashboardStats>("dash/all");
  const enquiries = useApiData<Paginated<Enquiry>>("enquiry/getall", { page: 1, limit: 6 });
  const subscribers = useApiData<SubscriberStats>("news/get", { page: 1, limit: 1 });
  const s = stats.data;
  const weekSignups = recentSignups(subscribers.data, 7);

  return (
    <>
      <PageHeader title={`${greeting()}, ${user.name.split(" ")[0]}`} description="Here's what's happening across the Mecatronix website." />

      {stats.error ? (
        <Card>
          <ErrorState message={stats.error} onRetry={stats.reload} />
        </Card>
      ) : !s ? (
        <Spinner />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Attention
              href="/admin/enquiries"
              icon={<Mail className="size-5" />}
              value={s.enquiries.unopened}
              label="Unread enquiries"
              detail={`${s.enquiries.total} total`}
              highlight={s.enquiries.unopened > 0}
            />
            <Attention
              href="/admin/reviews"
              icon={<MessageSquareQuote className="size-5" />}
              value={s.reviews.unverified}
              label="Reviews to verify"
              detail={`${s.reviews.verified} published`}
              highlight={s.reviews.unverified > 0}
            />
            <Attention
              href="/admin/subscribers"
              icon={<Newspaper className="size-5" />}
              value={s.subscribers}
              label="Newsletter subscribers"
              detail={weekSignups === null ? "…" : `${weekSignups} new this week`}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-display text-base font-semibold text-ink">Latest enquiries</h2>
                <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm text-muted-ink hover:text-accent-ink">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </div>
              {enquiries.error ? (
                <ErrorState message={enquiries.error} onRetry={enquiries.reload} />
              ) : !enquiries.data ? (
                <Spinner />
              ) : enquiries.data.items.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-muted">No enquiries yet. They appear here when someone uses the contact form.</p>
              ) : (
                <ul>
                  {enquiries.data.items.map((e) => (
                    <li key={e.id} className="border-b border-line last:border-0">
                      <Link href={`/admin/enquiries?open=${e.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-paper/60">
                        <span className={`mt-2 size-2 shrink-0 rounded-full ${e.is_opened ? "bg-transparent" : "bg-accent"}`} aria-label={e.is_opened ? undefined : "Unread"} />
                        <span className="min-w-0 flex-1">
                          <Stack primary={e.name || e.email} secondary={e.message} />
                        </span>
                        <span className="shrink-0 text-xs text-muted">{timeAgo(e.createdAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="h-fit">
              <h2 className="border-b border-line px-5 py-4 font-display text-base font-semibold text-ink">Website content</h2>
              <div className="divide-y divide-line">
                {[
                  ["Banners", s.banners, "/admin/banners"],
                  ["Blogs", s.blogs, "/admin/blogs"],
                  ["Works", s.works, "/admin/works"],
                  ["Projects", s.projects, "/admin/projects"],
                  ["Clients", s.clients, "/admin/clients"],
                ].map(([label, value, href]) => (
                  <Link key={label} href={String(href)} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-paper/60">
                    <span className="text-muted-ink">{label}</span>
                    <span className="font-display text-base font-semibold text-ink tabular-nums">{value}</span>
                  </Link>
                ))}
                {user.role === "superadmin" && (
                  <Link href="/admin/admins" className="flex items-center justify-between px-5 py-3 text-sm hover:bg-paper/60">
                    <span className="text-muted-ink">Admins</span>
                    <span className="flex items-center gap-2">
                      <Badge tone="accent">{s.admins.superadmin} super</Badge>
                      <span className="font-display text-base font-semibold text-ink tabular-nums">{s.admins.total}</span>
                    </span>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

function Attention({ href, icon, value, label, detail, highlight }: { href: string; icon: React.ReactNode; value: number; label: string; detail: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-lift"
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${highlight ? "bg-accent-soft text-accent-ink" : "bg-paper text-muted-ink"}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-muted">{detail}</span>
      </span>
    </Link>
  );
}
