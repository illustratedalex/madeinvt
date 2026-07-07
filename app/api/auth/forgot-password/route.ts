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

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return NextResponse.redirect(new URL("/forgot-password?error=reset_failed", request.url));
  }

  return NextResponse.redirect(new URL("/forgot-password?notice=password_reset_sent", request.url));
}
