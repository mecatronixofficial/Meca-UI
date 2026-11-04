"use client";

import { BadgeCheck, CircleSlash, Star } from "lucide-react";
import { useState } from "react";
import { useFeedback } from "../../_components/Feedback";
import { ResourcePage, type ResourceConfig } from "../../_components/ResourcePage";
import { Badge, IconButton, Stack } from "../../_components/ui";
import { api } from "../../_lib/api";
import { formatDate } from "../../_lib/format";
import type { Review } from "../../_lib/types";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`} title={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden className={`size-3.5 ${n <= value ? "fill-[#f5a524] text-[#f5a524]" : "text-line-strong"}`} />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const { toast } = useFeedback();
  const [refreshKey, setRefreshKey] = useState(0);

  const setVerified = async (row: Review, verified: boolean) => {
    try {
      await api(`review/edit/${row.id}`, { method: "PUT", body: { is_verified: verified } });
      toast.success(verified ? `Published the review from ${row.user_name}` : `Hid the review from ${row.user_name}`);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const config: ResourceConfig<Review> = {
    title: "Reviews",
    noun: "review",
    description: "Client testimonials. Only verified reviews appear on the website.",
    listPath: "review/all",
    createPath: "review/add",
    updatePath: (row) => `review/edit/${row.id}`,
    deletePath: (row) => `review/delete/${row.id}`,
    label: (row) => `the review from ${row.user_name}`,
    searchPlaceholder: "Search name, email, company, comment",
    filters: [
      {
        name: "verified",
        label: "Status",
        options: [
          { value: "false", label: "Awaiting verification" },
          { value: "true", label: "Verified" },
        ],
      },
    ],
    // On create the API decides verification (auto-verified when the email/company matches a client)
    fields: (row) => [
      { name: "user_name", label: "Name", type: "text", required: true },
      { name: "user_email", label: "Email", type: "email", required: true },
      { name: "company_name", label: "Company", type: "text", hint: row ? undefined : "Reviews from a known client's email or company are verified automatically." },
      { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5, required: true },
      { name: "comment", label: "Comment", type: "textarea", maxLength: 500 },
      ...(row ? [{ name: "is_verified", label: "Verified", type: "switch", description: "Show this review on the website." } as const] : []),
    ],
    defaults: { rating: "5" },
    columns: [
      { header: "Reviewer", cell: (row) => <Stack primary={row.user_name} secondary={row.company_name || row.user_email} /> },
      { header: "Rating", cell: (row) => <Stars value={row.rating} /> },
      { header: "Comment", cell: (row) => <span className="line-clamp-2">{row.comment || "—"}</span>, className: "hidden lg:table-cell" },
      { header: "Status", cell: (row) => (row.is_verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Pending</Badge>) },
      { header: "Date", cell: (row) => formatDate(row.createdAt), className: "hidden md:table-cell whitespace-nowrap" },
    ],
    rowActions: (row) =>
      row.is_verified ? (
        <IconButton label="Unverify (hide from website)" onClick={() => setVerified(row, false)}>
          <CircleSlash className="size-4" />
        </IconButton>
      ) : (
        <IconButton label="Verify (show on website)" onClick={() => setVerified(row, true)} className="text-[#067647]">
          <BadgeCheck className="size-4" />
        </IconButton>
      ),
  };

  return <ResourcePage config={config} refreshKey={refreshKey} />;
}
