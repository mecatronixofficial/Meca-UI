"use client";

import { Eye, Mail, MailOpen, Reply } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useFeedback } from "../../_components/Feedback";
import { Modal } from "../../_components/Modal";
import { ResourcePage, type ResourceConfig } from "../../_components/ResourcePage";
import { Badge, Button, ErrorState, IconButton, Spinner, Stack } from "../../_components/ui";
import { api } from "../../_lib/api";
import { formatDateTime, timeAgo } from "../../_lib/format";
import type { Enquiry } from "../../_lib/types";

export default function EnquiriesPage() {
  return (
    <Suspense>
      <Enquiries />
    </Suspense>
  );
}

function Enquiries() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useFeedback();
  const [viewing, setViewing] = useState<string | null>(params.get("open"));
  const [refreshKey, setRefreshKey] = useState(0);

  const setOpened = async (row: Enquiry, opened: boolean) => {
    try {
      await api(`enquiry/edit/${row.id}`, { method: "PUT", body: { is_opened: opened } });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const config: ResourceConfig<Enquiry> = {
    title: "Enquiries",
    noun: "enquiry",
    description: "Messages from the website contact form. Opening one marks it as read.",
    listPath: "enquiry/getall",
    deletePath: (row) => `enquiry/delete/${row.id}`,
    label: (row) => `Enquiry from ${row.name || row.email}`,
    searchPlaceholder: "Search name, email, company, message",
    filters: [
      {
        name: "opened",
        label: "Status",
        options: [
          { value: "false", label: "Unread" },
          { value: "true", label: "Read" },
        ],
      },
    ],
    emptyHint: "Enquiries arrive here when someone submits the contact form.",
    columns: [
      {
        header: "From",
        cell: (row) => (
          <button type="button" onClick={() => setViewing(row.id)} className="flex max-w-full items-start gap-2.5 text-left">
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${row.is_opened ? "bg-line-strong" : "bg-accent"}`} title={row.is_opened ? "Read" : "Unread"} />
            <Stack primary={<span className={row.is_opened ? "font-normal" : "font-semibold"}>{row.name || "—"}</span>} secondary={row.email} />
          </button>
        ),
      },
      { header: "Company", cell: (row) => row.company_name || "—", className: "hidden md:table-cell" },
      { header: "Message", cell: (row) => <span className="line-clamp-2">{row.message}</span>, className: "hidden lg:table-cell" },
      { header: "Received", cell: (row) => <span className="whitespace-nowrap">{timeAgo(row.createdAt)}</span> },
    ],
    rowActions: (row) => (
      <>
        <IconButton label="View" onClick={() => setViewing(row.id)}>
          <Eye className="size-4" />
        </IconButton>
        <IconButton label={row.is_opened ? "Mark as unread" : "Mark as read"} onClick={() => setOpened(row, !row.is_opened)}>
          {row.is_opened ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
        </IconButton>
      </>
    ),
  };

  const close = () => {
    setViewing(null);
    setRefreshKey((k) => k + 1);
    if (params.get("open")) router.replace("/admin/enquiries");
  };

  return (
    <>
      <ResourcePage config={config} refreshKey={refreshKey} />
      {viewing && <EnquiryViewer id={viewing} onClose={close} />}
    </>
  );
}

function EnquiryViewer({ id, onClose }: { id: string; onClose: () => void }) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetching a single enquiry marks it as read on the server
  useEffect(() => {
    api<Enquiry>(`enquiry/get/${id}`).then(
      ({ data }) => setEnquiry(data),
      (err: Error) => setError(err.message),
    );
  }, [id]);

  const replyHref = enquiry
    ? `mailto:${enquiry.email}?subject=${encodeURIComponent("Re: your enquiry to Mecatronix")}&body=${encodeURIComponent(`Hi ${enquiry.name || "there"},\n\n`)}`
    : undefined;

  return (
    <Modal
      open
      onClose={onClose}
      title={enquiry ? enquiry.name || enquiry.email : "Enquiry"}
      description={enquiry ? `Received ${formatDateTime(enquiry.createdAt)}` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {replyHref && (
            <a href={replyHref} className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent-strong px-4 text-sm font-medium text-white hover:bg-accent-ink">
              <Reply className="size-4" /> Reply by email
            </a>
          )}
        </>
      }
    >
      {error ? (
        <ErrorState message={error} />
      ) : !enquiry ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-5">
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Detail label="Email">
              <a href={`mailto:${enquiry.email}`} className="text-accent-ink hover:underline">
                {enquiry.email}
              </a>
            </Detail>
            <Detail label="Phone">
              {enquiry.phone ? (
                <a href={`tel:${enquiry.phone}`} className="text-accent-ink hover:underline">
                  {enquiry.phone}
                </a>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Company">{enquiry.company_name || "—"}</Detail>
            <Detail label="Status">
              <Badge tone="success">Read {enquiry.opened_at ? timeAgo(enquiry.opened_at) : ""}</Badge>
            </Detail>
          </dl>
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink">Message</p>
            <p className="rounded-xl bg-paper px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap text-surface">{enquiry.message}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-ink">{children}</dd>
    </div>
  );
}
