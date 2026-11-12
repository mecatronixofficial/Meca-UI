import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_TAGS, type ContentTag } from "../../../lib/content";

/**
 * Cache refresh webhook (POST /api/revalidate), called by mec-api after an
 * admin edits website content. Body: { "tags": ["blogs", "projects", ...] }.
 * Auth: header `x-revalidate-secret` must equal REVALIDATE_SECRET (the API's
 * SITE_REVALIDATE_SECRET). Expired content is re-fetched on the next visit.
 */

const matches = (given: string, expected: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Revalidation is not configured." }, { status: 503 });
  if (!matches(request.headers.get("x-revalidate-secret") ?? "", secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const requested = Array.isArray(body?.tags) ? body.tags : Object.keys(CONTENT_TAGS);
  const tags = requested.filter((tag): tag is ContentTag => typeof tag === "string" && tag in CONTENT_TAGS);
  if (!tags.length) return NextResponse.json({ ok: false, error: "No known tags." }, { status: 400 });

  // Expire now, so the next visitor gets fresh content rather than one stale render
  for (const tag of tags) revalidateTag(CONTENT_TAGS[tag], { expire: 0 });

  return NextResponse.json({ ok: true, revalidated: tags });
}
