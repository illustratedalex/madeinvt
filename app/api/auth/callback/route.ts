import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "Accounts are not enabled yet. Email partners@madeinvt.com to request early access." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const redirectUrl = new URL("/auth/callback", request.url);
  url.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });
  return NextResponse.redirect(redirectUrl);
}
