"use client";

import { ResourcePage, type ResourceConfig } from "../../_components/ResourcePage";
import { Badge, Stack, Thumb } from "../../_components/ui";
import { formatDateTime } from "../../_lib/format";
import type { Banner } from "../../_lib/types";

const config: ResourceConfig<Banner> = {
  title: "Banners",
  noun: "banner",
  description: "Hero slides for the website. Each banner needs its own position number.",
  listPath: "banner/get",
  createPath: "banner/add",
  updatePath: (row) => `banner/edit/${row.id}`,
  deletePath: (row) => `banner/delete/${row.id}`,
  label: (row) => row.name,
  fields: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 100 },
    { name: "position", label: "Position", type: "number", min: 1, required: true, hint: "1 shows first. Two banners can't share a position." },
    { name: "description", label: "Description", type: "textarea", required: true, maxLength: 500, rows: 3 },
    { name: "img", label: "Image", type: "image", folder: "banners", required: true, wide: true },
    { name: "time", label: "Date", type: "datetime", hint: "Optional. Defaults to now." },
    { name: "is_active", label: "Active", type: "switch", description: "Show this banner on the website." },
  ],
  columns: [
    {
      header: "Banner",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Thumb src={row.img} className="h-10 w-16" />
          <Stack primary={row.name} secondary={row.description} />
        </span>
      ),
    },
    { header: "Position", cell: (row) => <span className="font-mono tabular-nums">#{row.position}</span> },
    { header: "Status", cell: (row) => (row.is_active ? <Badge tone="success">Active</Badge> : <Badge>Hidden</Badge>) },
    { header: "Date", cell: (row) => formatDateTime(row.time), className: "hidden md:table-cell whitespace-nowrap" },
  ],
};

export default function BannersPage() {
  return <ResourcePage config={config} />;
}
