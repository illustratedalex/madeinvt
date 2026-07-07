import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/forgot-password?error=auth_not_enabled", request.url));
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return NextResponse.redirect(new URL("/forgot-password?error=missing_email", request.url));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || new URL(request.url).origin;
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`,
  });

  if (error) {
    return NextResponse.redirect(new URL("/forgot-password?error=reset_failed", request.url));
  }

  return NextResponse.redirect(new URL("/forgot-password?notice=password_reset_sent", request.url));
}
