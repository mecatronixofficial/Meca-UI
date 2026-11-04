import type { Metadata } from "next";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Reset password" };

/** Target of the password-reset email (the API's RESET_PASSWORD_URL / ADMIN_URL + /reset-password). */
export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ResetForm token={token} />;
}
