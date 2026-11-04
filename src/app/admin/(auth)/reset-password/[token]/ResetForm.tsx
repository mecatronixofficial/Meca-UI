"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../_lib/api";
import { Alert, Button, Field, Input, Spinner } from "../../../_components/ui";

const MIN_LENGTH = 8;

export default function ResetForm({ token }: { token: string }) {
  const [status, setStatus] = useState<"checking" | "valid" | "invalid" | "done">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api("auth/verifyresettoken", { body: { token } }).then(
      () => setStatus("valid"),
      () => setStatus("invalid"),
    );
  }, [token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      await api("auth/reset_password", { body: { token, newPassword: password } });
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  };

  if (status === "checking") return <Spinner label="Checking your link" className="py-8" />;

  if (status === "invalid" || status === "done") {
    const done = status === "done";
    return (
      <>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{done ? "Password updated" : "Link expired"}</h1>
        <p className="mt-2 text-sm text-muted-ink">
          {done ? "Your password has been reset. You can sign in with it now." : "This reset link is invalid or has already been used. Request a new one from the sign-in page."}
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-accent-strong text-sm font-medium text-white hover:bg-accent-ink"
        >
          Go to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Choose a new password</h1>
      <p className="mt-1 text-sm text-muted-ink">At least {MIN_LENGTH} characters. This link works once.</p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <Field label="New password" htmlFor="password">
          <Input id="password" type="password" autoComplete="new-password" required minLength={MIN_LENGTH} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field label="Confirm password" htmlFor="confirm">
          <Input id="confirm" type="password" autoComplete="new-password" required minLength={MIN_LENGTH} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <Button type="submit" loading={busy} className="mt-1 w-full">
          Reset password
        </Button>
      </form>
    </>
  );
}
