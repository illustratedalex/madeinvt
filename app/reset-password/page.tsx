import { hasSupabaseConfig } from "@/lib/supabase/config";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Set New Password | MadeInVT",
  description: "Set a new password for your MadeInVT maker account.",
  path: "/reset-password",
});

const errorMessages: Record<string, string> = {
  auth_not_enabled: "Password reset is not enabled yet. Email partners@madeinvt.com for help.",
  missing_fields: "Enter and confirm your new password.",
  password_mismatch: "Passwords do not match.",
  password_too_short: "Password must be at least 8 characters.",
  reset_failed: "Unable to update your password. Request a new reset email and try again.",
  session_required: "Your reset session has expired. Request a new reset email.",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : "";
  const authEnabled = hasSupabaseConfig();

  return (
    <section className="mx-auto max-w-xl space-y-6 px-6 py-12 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Maker Portal Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm leading-7 text-slate-700">Choose a secure password with at least 8 characters.</p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}
      {!authEnabled ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Password reset is not enabled yet. Email{" "}
          <a href="mailto:partners@madeinvt.com" className="font-semibold underline underline-offset-2">
            partners@madeinvt.com
          </a>{" "}
          for help.
        </p>
      ) : null}

      <ResetPasswordForm authEnabled={authEnabled} />
    </section>
  );
}
