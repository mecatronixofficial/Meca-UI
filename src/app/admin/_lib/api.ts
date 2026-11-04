"use client";

import { useCallback, useEffect, useState } from "react";
import type { UploadFolder } from "./types";

/**
 * Browser client for the admin API. Every call goes through this site's
 * /api/admin proxy, which forwards it to mec-api with the session cookie.
 */

export type Query = Record<string, string | number | boolean | null | undefined>;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Fired on any 401 so the panel can send the admin back to the login page. */
export const UNAUTHORIZED_EVENT = "admin:unauthorized";

export function buildPath(path: string, query?: Query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return `/api/admin/${path}${search ? `?${search}` : ""}`;
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; query?: Query } = {},
): Promise<{ message: string; data: T }> {
  const { body, query } = options;
  const isForm = body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(buildPath(path, query), {
      method: options.method ?? (body === undefined ? "GET" : "POST"),
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const json = (await res.json().catch(() => null)) as { success?: boolean; message?: unknown; data?: T } | null;
  if (!res.ok || json?.success === false) {
    const raw = json?.message;
    // Validation errors arrive as an array of messages
    const message = Array.isArray(raw) ? raw.join(". ") : typeof raw === "string" && raw ? raw : `Request failed (${res.status})`;
    if (res.status === 401 && path !== "auth/login") window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new ApiError(message, res.status);
  }
  return { message: typeof json?.message === "string" ? json.message : "", data: json?.data as T };
}

/** Uploads one file to R2 and returns its public URL. One file per request keeps each request small. */
export async function uploadFile(file: File, folder: UploadFolder): Promise<string> {
  const form = new FormData();
  form.append("images", file);
  form.append("folder", folder);
  const { data } = await api<{ url: string }[]>("img/upload", { body: form });
  if (!data?.[0]?.url) throw new ApiError("Upload failed", 500);
  return data[0].url;
}

/**
 * Loads `path` and reloads whenever the path or query changes. `loading` is
 * derived from whether the stored result matches the current request.
 */
export function useApiData<T>(path: string | null, query?: Query) {
  const key = path ? buildPath(path, query) : null;
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<{ key: string; nonce: number; data?: T; error?: string } | null>(null);

  useEffect(() => {
    if (!path || !key) return;
    let live = true;
    api<T>(path, { query }).then(
      ({ data }) => live && setResult({ key, nonce, data }),
      (error: Error) => live && setResult((prev) => ({ key, nonce, data: prev?.key === key ? prev.data : undefined, error: error.message })),
    );
    return () => {
      live = false;
    };
    // `key` already encodes path and query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  const fresh = result?.key === key;
  return {
    data: fresh ? result?.data : undefined,
    error: fresh && result?.nonce === nonce ? result?.error : undefined,
    loading: !!key && (!fresh || result?.nonce !== nonce),
    // Keeps showing the previous rows while the next page or filter loads
    stale: result?.data,
    reload: useCallback(() => setNonce((n) => n + 1), []),
  };
}
