import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTemplate } from "../../../data/templates";
import { getPreview } from "../../../lib/previews";
import PreviewViewer from "./PreviewViewer";

type Props = { params: Promise<{ id: string }> };

// Each visitor's preview is personal: always render fresh, never index
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const preview = await getPreview((await params).id);
  return {
    title: preview ? `${preview.company_name} — Website preview` : "Website preview",
    description: preview ? `A ${getTemplate(preview.industry)?.name ?? "business"} website preview for ${preview.company_name}, by Mecatronix.` : undefined,
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({ params }: Props) {
  const preview = await getPreview((await params).id);
  if (!preview) notFound();
  return (
    <Suspense>
      <PreviewViewer preview={preview} />
    </Suspense>
  );
}
