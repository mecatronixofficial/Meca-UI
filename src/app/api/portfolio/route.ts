import { NextResponse } from "next/server";
import { getProjects } from "../../../lib/content";

/** Public portfolio data for the separate mec-admin media library. No session is used. */
export async function GET() {
  return NextResponse.json({ success: true, data: await getProjects() }, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
}
