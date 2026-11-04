"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "../../_components/AdminShell";
import { useFeedback } from "../../_components/Feedback";
import { FormFields, toPayload, toValues, type FieldDef, type Values } from "../../_components/fields";
import { Alert, Badge, Button, Card, Field, Input, PageHeader } from "../../_components/ui";
import { api } from "../../_lib/api";
import type { Admin } from "../../_lib/types";

const profileFields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, maxLength: 100 },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true, wide: true, hint: "You sign in with this address." },
  { name: "img", label: "Photo", type: "image", folder: "admins" },
];

export default function AccountPage() {
  const { user, setUser } = useSession();
  const { toast } = useFeedback();

  const [profile, setProfile] = useState<Values>(() => toValues(profileFields, user as unknown as Record<string, unknown>));
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      const { data, message } = await api<Admin>(`admin/update_admin/${user.id}`, { method: "PUT", body: toPayload(profileFields, profile) });
      setUser({ ...user, ...data });
      toast.success(message || "Profile updated");
    } catch (error) {
      setProfileError((error as Error).message);
    }
    setSavingProfile(false);
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return setPasswordError("The new passwords don't match.");
    setSavingPassword(true);
    setPasswordError(null);
    try {
      const { message } = await api("auth/change_password", { body: { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword } });
      setPasswords({ oldPassword: "", newPassword: "", confirm: "" });
      toast.success(message || "Password changed");
    } catch (error) {
      setPasswordError((error as Error).message);
    }
    setSavingPassword(false);
  };

  const setPw = (key: keyof typeof passwords) => (e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, [key]: e.target.value });

  return (
    <>
      <PageHeader title="My account" description="Your profile and sign-in password." />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-ink">Profile</h2>
            <Badge tone={user.role === "superadmin" ? "accent" : "neutral"}>{user.role === "superadmin" ? "Superadmin" : "Admin"}</Badge>
          </div>
          <form onSubmit={saveProfile} className="flex flex-col gap-5">
            {profileError && <Alert onDismiss={() => setProfileError(null)}>{profileError}</Alert>}
            <FormFields fields={profileFields} values={profile} onChange={setProfile} />
            <Button type="submit" loading={savingProfile} className="self-start">
              Save profile
            </Button>
          </form>
        </Card>

        <Card className="h-fit p-5 sm:p-6">
          <h2 className="mb-5 font-display text-base font-semibold text-ink">Change password</h2>
          <form onSubmit={changePassword} className="flex flex-col gap-4">
            {passwordError && <Alert onDismiss={() => setPasswordError(null)}>{passwordError}</Alert>}
            <Field label="Current password" htmlFor="old-password">
              <Input id="old-password" type="password" autoComplete="current-password" required value={passwords.oldPassword} onChange={setPw("oldPassword")} />
            </Field>
            <Field label="New password" htmlFor="new-password" hint="At least 8 characters.">
              <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={passwords.newPassword} onChange={setPw("newPassword")} />
            </Field>
            <Field label="Confirm new password" htmlFor="confirm-password">
              <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={passwords.confirm} onChange={setPw("confirm")} />
            </Field>
            <Button type="submit" loading={savingPassword} className="self-start">
              Change password
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
