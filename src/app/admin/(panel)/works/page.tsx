"use client";

import { ResourcePage, type ResourceConfig } from "../../_components/ResourcePage";
import { Badge, Stack, Thumb } from "../../_components/ui";
import { useApiData } from "../../_lib/api";
import type { Project, Work } from "../../_lib/types";

export default function WorksPage() {
  const projects = useApiData<Project[]>("project/all");

  const config: ResourceConfig<Work> = {
    title: "Works",
    noun: "work",
    description: "Case studies made of sections, optionally linked to a project.",
    listPath: "work/get",
    createPath: "work/add",
    updatePath: (row) => `work/edit/${row.id}`,
    deletePath: (row) => `work/delete/${row.id}`,
    label: (row) => row.title,
    formSize: "xl",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 100 },
      {
        name: "project_id",
        label: "Linked project",
        type: "select",
        nullable: true,
        placeholder: "No project",
        options: (projects.data ?? []).map((p) => ({ value: p.id, label: p.project_name })),
      },
      {
        name: "info",
        label: "Sections",
        type: "group",
        itemLabel: "Section",
        addLabel: "Add section",
        required: true,
        min: 1,
        fields: [
          { name: "heading", label: "Heading", type: "text", required: true, wide: true },
          { name: "details", label: "Details", type: "textarea", required: true, rows: 4 },
          { name: "img", label: "Image", type: "image", folder: "works", required: true, wide: true },
        ],
      },
      { name: "is_active", label: "Active", type: "switch", description: "Show this work on the website." },
    ],
    columns: [
      {
        header: "Work",
        cell: (row) => (
          <span className="flex items-center gap-3">
            <Thumb src={row.info[0]?.img} />
            <Stack primary={row.title} secondary={row.info[0]?.heading} />
          </span>
        ),
      },
      { header: "Sections", cell: (row) => row.info.length, className: "hidden md:table-cell" },
      { header: "Project", cell: (row) => row.project?.project_name ?? "—", className: "hidden md:table-cell" },
      { header: "Status", cell: (row) => (row.is_active ? <Badge tone="success">Active</Badge> : <Badge>Hidden</Badge>) },
    ],
  };

  return <ResourcePage config={config} />;
}
