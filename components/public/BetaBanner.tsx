"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useState } from "react";

const DISMISS_KEY = "madeinvt-beta-banner-dismissed";

function isPublicPath(pathname: string): boolean {
  return !pathname.startsWith("/basecamp") && !pathname.startsWith("/partner-portal") && !pathname.startsWith("/admin");
}

// useSyncExternalStore requires a subscribe function; localStorage has no change events,
// so we return a no-op unsubscribe.
const noopSubscribe = () => () => {};

function getStoredDismissed() {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerDismissed() {
  return false;
}

export function BetaBanner() {
  const pathname = usePathname();
  // Track dismiss clicks that happen in the current session.
  const [manualDismissed, setManualDismissed] = useState(false);
  // Read persisted dismissal from localStorage without calling setState inside an effect.
  const storedDismissed = useSyncExternalStore(noopSubscribe, getStoredDismissed, getServerDismissed);

  const dismissed = storedDismissed || manualDismissed;

  if (!isPublicPath(pathname) || dismissed) {
    return null;
  }

  return (
    <div className="border-b border-[#d7cbb3] bg-[#f7efe1] px-4 py-2 text-sm text-slate-700 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="leading-6">
          MadeInVT is currently in Public Beta. We&apos;re adding new makers every week. Know an artisan we should feature?{" "}
          <Link href="/feedback" className="font-semibold text-[#1f3b2f] underline">
            Let us know.
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setManualDismissed(true);
            try {
              window.localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              // ignore local storage failures
            }
          }}
          className="shrink-0 rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
