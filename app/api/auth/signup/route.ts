import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";
import { hasSupabaseConfig, requireAppUrl } from "@/lib/supabase/config";
import { linkApprovedClaimsForOwnerEmail } from "@/lib/claims/liveClaims";

const accountTypes = new Set(["Maker", "Studio", "Partner"]);

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/signup?error=auth_not_enabled", request.url));
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const accountType = String(formData.get("accountType") ?? "");

  if (!name || !email || !password) {
    return NextResponse.redirect(new URL("/signup?error=missing_fields", request.url));
  }
  if (password.length < 8) {
    return NextResponse.redirect(new URL("/signup?error=password_too_short", request.url));
  }
  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL("/signup?error=password_mismatch", request.url));
  }
  if (!accountTypes.has(accountType)) {
    return NextResponse.redirect(new URL("/signup?error=invalid_account_type", request.url));
  }

  let appUrl = "";
  try {
    appUrl = requireAppUrl();
  } catch {
    return NextResponse.redirect(new URL("/signup?error=auth_not_enabled", request.url));
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        account_type: accountType,
      },
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(new URL("/signup?error=signup_failed", request.url));
  }

  if (data.user?.id && data.user.email) {
    try {
      await linkApprovedClaimsForOwnerEmail(data.user.id, data.user.email);
    } catch (linkError) {
      console.error("Deferred claim owner linking failed on signup:", linkError);
    }
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login?notice=confirm_email", request.url));
  }

  const response = NextResponse.redirect(new URL("/partner-portal", request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
