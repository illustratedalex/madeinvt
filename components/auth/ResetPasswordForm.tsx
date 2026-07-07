"use client";

import { useState } from "react";

interface ResetPasswordFormProps {
  authEnabled: boolean;
}

function getHashParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  return new URLSearchParams(hash);
}

function getInitialResetParams() {
  if (typeof window === "undefined") {
    return {
      accessToken: "",
      tokenHash: "",
      otpType: "",
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = getHashParams();
  const tokenFromHash = hashParams.get("access_token") ?? "";
  const tokenFromQuery = searchParams.get("access_token") ?? "";

  return {
    accessToken: tokenFromHash || tokenFromQuery,
    tokenHash: searchParams.get("token_hash") ?? "",
    otpType: searchParams.get("type") ?? "",
  };
}

export function ResetPasswordForm({ authEnabled }: ResetPasswordFormProps) {
  const [resetParams] = useState(getInitialResetParams);

  return (
    <form action="/api/auth/reset-password" method="post" className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <input type="hidden" name="accessToken" value={resetParams.accessToken} />
      <input type="hidden" name="tokenHash" value={resetParams.tokenHash} />
      <input type="hidden" name="otpType" value={resetParams.otpType} />
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        New password
        <input
          type="password"
          name="password"
          minLength={8}
          required
          className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Confirm new password
        <input
          type="password"
          name="confirmPassword"
          minLength={8}
          required
          className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
        />
      </label>
      <button
        type="submit"
        disabled={!authEnabled}
        className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Update password
      </button>
    </form>
  );
}
