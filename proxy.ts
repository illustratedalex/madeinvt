import type { NextRequest } from "next/server";
import { middleware as supabaseMiddleware } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  // Reject malformed variants of these public routes before the page handler.
  if (/^\/(?:businesses|collections|events|guides|makers)(?:%5c|\\)\/?$/i.test(request.nextUrl.pathname)) {
    return new Response("Bad Request", { status: 400 });
  }

  return supabaseMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
