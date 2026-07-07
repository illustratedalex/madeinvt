import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/login?error=auth_not_enabled", request.url));
  }

  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next");

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", request.url));
  }

  const otpType = type as EmailOtpType;
  if (!["signup", "invite", "magiclink", "recovery", "email_change", "email"].includes(otpType)) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", request.url));
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: otpType,
  });

  if (error || !data.session?.access_token) {
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url));
  }

  const destination = next && next.startsWith("/") ? next : "/partner-portal";
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
