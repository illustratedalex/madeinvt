import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "Accounts are not enabled yet. Email partners@madeinvt.com to request early access." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const next = String(formData.get("next") ?? "").trim();
  const encodedNext = next.startsWith("/") ? `?next=${encodeURIComponent(next)}` : "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || new URL(request.url).origin;

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=missing_email", request.url));
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback${encodedNext}`,
    },
  });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=magic_link_failed", request.url));
  }

  return NextResponse.redirect(new URL("/login?notice=magic_link_sent", request.url));
}
