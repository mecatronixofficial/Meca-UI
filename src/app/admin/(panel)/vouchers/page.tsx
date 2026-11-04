"use client";

import { Eye, Send } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../_components/Modal";
import { ResourcePage, type ResourceConfig } from "../../_components/ResourcePage";
import { Button, IconButton, Stack, Thumb } from "../../_components/ui";
import { formatDateTime } from "../../_lib/format";
import type { Voucher } from "../../_lib/types";

export default function VouchersPage() {
  const [viewing, setViewing] = useState<Voucher | null>(null);

  const config: ResourceConfig<Voucher> = {
    title: "Vouchers",
    noun: "voucher",
    description: "Offers and announcements. Creating a voucher emails it to every newsletter subscriber straight away.",
    listPath: "voucher/all",
    createPath: "voucher/add",
    deletePath: (row) => `voucher/delete/${row.id}`,
    label: (row) => row.title,
    createLabel: "New voucher",
    confirmCreate: {
      title: "Send to all subscribers?",
      message: "This voucher will be emailed to every newsletter subscriber as soon as it's created. Sent emails can't be recalled.",
      confirmLabel: "Create & send",
    },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true, placeholder: "e.g. Diwali offer: 20% off websites" },
      { name: "heading", label: "Highlight", type: "text", wide: true, hint: "Optional line shown under the title." },
      { name: "message", label: "Message", type: "textarea", required: true, rows: 6 },
      { name: "img", label: "Images", type: "images", folder: "vouchers" },
    ],
    // The API stores heading and message as arrays; the email uses the first of each
    payload: ({ heading, message, ...body }) => ({ ...body, heading: heading ? [heading] : [], msg: [message] }),
    columns: [
      {
        header: "Voucher",
        cell: (row) => (
          <span className="flex items-center gap-3">
            <Thumb src={row.img[0]} />
            <Stack primary={row.title} secondary={row.heading[0] || row.msg[0]} />
          </span>
        ),
      },
      { header: "Message", cell: (row) => <span className="line-clamp-2">{row.msg[0]}</span>, className: "hidden lg:table-cell" },
      { header: "Sent", cell: (row) => formatDateTime(row.createdAt), className: "whitespace-nowrap" },
    ],
    rowActions: (row) => (
      <IconButton label="Preview" onClick={() => setViewing(row)}>
        <Eye className="size-4" />
      </IconButton>
    ),
    headerActions: (
      <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
        <Send className="size-3.5" /> Sent by email on create
      </span>
    ),
  };

  return (
    <>
      <ResourcePage config={config} />
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? ""}
        description={viewing ? `Sent ${formatDateTime(viewing.createdAt)}` : undefined}
        footer={
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing && (
          <div className="flex flex-col gap-4">
            {viewing.heading[0] && <p className="font-display text-lg font-semibold text-accent-ink">{viewing.heading[0]}</p>}
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-surface">{viewing.msg.join("\n\n")}</p>
            {viewing.img.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="w-full rounded-xl border border-line" />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
