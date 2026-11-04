"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../_lib/api";
import { Alert, Button, Field, Input } from "../../_components/ui";

/** Only same-site admin paths are valid return targets. */
const safeNext = (value: string | null) => (value && value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin");

export default function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in: skip the form
  useEffect(() => {
    api("auth/check_login").then(
      () => router.replace(next),
      () => undefined,
    );
  }, [router, next]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "login") {
        await api("auth/login", { body: { email, password } });
        router.replace(next);
        return;
      }
      const { message } = await api("auth/forgot_password", { body: { email } });
      setNotice(message || "If the account exists, a password reset email has been sent.");
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  };

  const switchMode = (to: "login" | "forgot") => {
    setMode(to);
    setError(null);
    setNotice(null);
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{mode === "login" ? "Sign in" : "Reset your password"}</h1>
      <p className="mt-1 text-sm text-muted-ink">
        {mode === "login" ? "Use your Mecatronix admin account." : "Enter your account email and we'll send you a reset link."}
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        {notice && <Alert tone="success">{notice}</Alert>}

        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        {mode === "login" && (
          <Field label="Password" htmlFor="password">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
        )}

        <Button type="submit" loading={busy} className="mt-1 w-full">
          {mode === "login" ? "Sign in" : "Send reset link"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => switchMode(mode === "login" ? "forgot" : "login")}
        className="mt-5 w-full text-center text-sm text-muted-ink hover:text-accent-ink"
      >
        {mode === "login" ? "Forgot your password?" : "← Back to sign in"}
      </button>
    </>
  );
}
