import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { linkApprovedClaimsForOwnerEmail } from "@/lib/claims/liveClaims";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/login?error=auth_not_enabled", request.url));
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();
  const destination = next.startsWith("/") ? next : "/partner-portal";

  if (!email || !password) {
    return NextResponse.redirect(new URL("/login?error=missing_fields", request.url));
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session?.access_token) {
    return NextResponse.redirect(new URL("/login?error=invalid_credentials", request.url));
  }

  if (data.user?.id && data.user.email) {
    try {
      await linkApprovedClaimsForOwnerEmail(data.user.id, data.user.email);
    } catch (linkError) {
      console.error("Deferred claim owner linking failed on login:", linkError);
    }
  }

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
