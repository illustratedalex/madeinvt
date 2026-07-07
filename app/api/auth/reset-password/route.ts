import { NextResponse } from "next/server";
import { createSupabaseUserClient, getOwnerAccessToken } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/reset-password?error=auth_not_enabled", request.url));
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirmPassword) {
    return NextResponse.redirect(new URL("/reset-password?error=missing_fields", request.url));
  }
  if (password.length < 8) {
    return NextResponse.redirect(new URL("/reset-password?error=password_too_short", request.url));
  }
  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL("/reset-password?error=password_mismatch", request.url));
  }

  const accessToken = await getOwnerAccessToken();
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
