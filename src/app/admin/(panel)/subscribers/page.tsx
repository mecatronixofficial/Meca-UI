"use client";

import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../lib/cn";
import { useFeedback } from "../../_components/Feedback";
import { Button, Card, EmptyState, ErrorState, PageHeader, Pagination, SearchInput, Spinner } from "../../_components/ui";
import { api, useApiData } from "../../_lib/api";
import { formatDateTime, timeAgo } from "../../_lib/format";
import type { SubscriberStats } from "../../_lib/types";

const PAGE_SIZE = 25;

export default function SubscribersPage() {
  const { toast, confirm } = useFeedback();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  const list = useApiData<SubscriberStats>("news/get", { page, limit: PAGE_SIZE, search });
  const result = list.data ?? list.stale;
  const rows = result?.subscribers ?? [];
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const removeSelected = async () => {
    const ids = [...selected];
    const ok = await confirm({
      title: `Remove ${ids.length} subscriber${ids.length === 1 ? "" : "s"}?`,
      message: "They will stop receiving the newsletter and voucher emails. This can't be undone.",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    try {
      const { message } = await api("news/delete", { method: "DELETE", body: { ids } });
      toast.success(message);
      setSelected(new Set());
      if (ids.length >= rows.length && page > 1) setPage(page - 1);
      else list.reload();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Without page/limit the API returns every subscriber
  const exportCsv = async () => {
    setExporting(true);
    try {
      const { data } = await api<SubscriberStats>("news/get");
      const csv = ["email,subscribed_at", ...data.subscribers.map((s) => `${s.email},${s.subscribedAt}`)].join("\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      link.download = `mecatronix-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      toast.error((error as Error).message);
    }
    setExporting(false);
  };

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="People signed up to the newsletter. Vouchers are emailed to everyone on this list."
        actions={
          <Button variant="secondary" icon={<Download className="size-4" />} loading={exporting} onClick={exportCsv} disabled={!result?.total}>
            Export CSV
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            placeholder="Search email"
            onChange={(value) => {
              setSearch(value);
              setPage(1);
              setSelected(new Set());
            }}
          />
          {selected.size > 0 && (
            <Button variant="danger" size="sm" icon={<Trash2 className="size-3.5" />} onClick={removeSelected}>
              Remove {selected.size}
            </Button>
          )}
          {result && <span className="text-sm text-muted sm:ml-auto">{result.total} subscribed</span>}
        </div>

        {list.error && !result ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : !result ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title={search ? "No matches" : "No subscribers yet"} description={search ? "Try a different search." : "Sign-ups from the website newsletter form appear here."} />
        ) : (
          <div className={cn("overflow-x-auto", list.loading && "opacity-60")}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="w-10 px-4 py-2.5">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                      className="size-4 accent-[var(--color-accent-strong)]"
                    />
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className={cn("border-b border-line last:border-0", selected.has(row.id) ? "bg-accent-soft/50" : "hover:bg-paper/60")}>
                    <td className="px-4 py-3">
                      <input type="checkbox" aria-label={`Select ${row.email}`} checked={selected.has(row.id)} onChange={() => toggle(row.id)} className="size-4 accent-[var(--color-accent-strong)]" />
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{row.email}</td>
                    <td className="px-4 py-3 text-muted-ink" title={formatDateTime(row.subscribedAt)}>
                      {timeAgo(row.subscribedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result?.meta && result.meta.totalPages > 1 && (
          <Pagination
            meta={result.meta}
            onPage={(p) => {
              setPage(p);
              setSelected(new Set());
            }}
          />
        )}
      </Card>
    </>
  );
}
