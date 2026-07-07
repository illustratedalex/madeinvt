import { NextResponse } from "next/server";
import { createSupabaseUserClient, getOwnerAccessToken, OWNER_AUTH_COOKIE } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/config";

async function buildLogoutResponse(request: Request) {
  if (hasSupabaseConfig()) {
    const accessToken = await getOwnerAccessToken();
    if (accessToken) {
      const supabaseUserClient = createSupabaseUserClient(accessToken);
      const { error } = await supabaseUserClient.auth.signOut();
      if (error) {
        console.error("Owner logout sign-out failed:", error.message);
      }
    }
  }

  const response = NextResponse.redirect(new URL("/login?notice=logged_out", request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: Request) {
  return buildLogoutResponse(request);
}

export async function POST(request: Request) {
  return buildLogoutResponse(request);
}
