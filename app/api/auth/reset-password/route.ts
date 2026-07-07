import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseUserClient, getOwnerAccessToken } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/reset-password?error=auth_not_enabled", request.url));
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const accessTokenFromForm = String(formData.get("accessToken") ?? "").trim();
  const tokenHash = String(formData.get("tokenHash") ?? "").trim();
  const otpType = String(formData.get("otpType") ?? "").trim();

  if (!password || !confirmPassword) {
    return NextResponse.redirect(new URL("/reset-password?error=missing_fields", request.url));
  }
  if (password.length < 8) {
    return NextResponse.redirect(new URL("/reset-password?error=password_too_short", request.url));
  }
  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL("/reset-password?error=password_mismatch", request.url));
  }

  let accessToken = accessTokenFromForm;
  if (!accessToken && tokenHash && otpType) {
    const type = otpType as EmailOtpType;
    if (!["signup", "invite", "magiclink", "recovery", "email_change", "email"].includes(type)) {
      return NextResponse.redirect(new URL("/reset-password?error=session_required", request.url));
    }
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error || !data.session?.access_token) {
      return NextResponse.redirect(new URL("/reset-password?error=session_required", request.url));
    }
    accessToken = data.session.access_token;
  }
  if (!accessToken) {
    accessToken = (await getOwnerAccessToken()) ?? "";
  }
  if (!accessToken) {
    return NextResponse.redirect(new URL("/reset-password?error=session_required", request.url));
  }

  const supabaseUserClient = createSupabaseUserClient(accessToken);
  const { error } = await supabaseUserClient.auth.updateUser({ password });
  if (error) {
    return NextResponse.redirect(new URL("/reset-password?error=reset_failed", request.url));
  }

  return NextResponse.redirect(new URL("/login?notice=password_updated", request.url));
}
