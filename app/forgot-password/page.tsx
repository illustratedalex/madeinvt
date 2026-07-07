import Link from "next/link";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Forgot Password | MadeInVT",
  description: "Request a password reset link for your MadeInVT maker account.",
  path: "/forgot-password",
});

const errorMessages: Record<string, string> = {
  auth_not_enabled: "Password reset is not enabled yet. Email partners@madeinvt.com for early access help.",
  missing_email: "Enter your account email.",
  reset_failed: "Unable to send reset email right now. Please try again.",
};

const noticeMessages: Record<string, string> = {
  password_reset_sent: "If your email is registered, a password reset link has been sent.",
};

interface ForgotPasswordPageProps {
  searchParams: Promise<{ error?: string; notice?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : "";
  const notice = params.notice ? noticeMessages[params.notice] : "";
  const authEnabled = hasSupabaseConfig();

  return (
    <section className="mx-auto max-w-xl space-y-6 px-6 py-12 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Maker Portal Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          Enter your account email and we&apos;ll send a secure reset link.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}
      {notice ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>
      ) : null}
      {!authEnabled ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Password reset is not enabled yet. Email{" "}
          <a href="mailto:partners@madeinvt.com" className="font-semibold underline underline-offset-2">
            partners@madeinvt.com
          </a>{" "}
          for early access help.
        </p>
      ) : null}

      <form action="/api/auth/forgot-password" method="post" className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
        <button
          type="submit"
          disabled={!authEnabled}
          className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send reset link
        </button>
      </form>

      <p className="text-sm text-slate-700">
        Back to{" "}
        <Link href="/login" className="font-semibold text-[#1f3b2f] underline underline-offset-4">
          Login
        </Link>
      </p>
    </section>
  );
}
