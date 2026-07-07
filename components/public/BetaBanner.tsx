"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useState } from "react";
import { madeInVTConfig } from "@/config/publications/madeinvt";

const DISMISS_KEY = "madeinvt-beta-banner-dismissed";
const DEFAULT_BETA_MESSAGE = "MadeInVT is currently in Public Beta. We're adding new makers every week. Know an artisan we should feature?";
const DEFAULT_BETA_CTA_LABEL = "Let us know.";
const DEFAULT_BETA_CTA_HREF = "/feedback";

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

  const betaBanner = madeInVTConfig.betaBanner;
  const betaMessage = betaBanner?.message || DEFAULT_BETA_MESSAGE;
  const betaCtaLabel = betaBanner?.ctaLabel || DEFAULT_BETA_CTA_LABEL;
  const betaCtaHref = betaBanner?.ctaHref || DEFAULT_BETA_CTA_HREF;

  return (
    <div className="border-b border-[#d7cbb3] bg-[#f7efe1] px-4 py-2 text-sm text-slate-700 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="leading-6">
          {betaMessage}{" "}
          <Link href={betaCtaHref} className="font-semibold text-[#1f3b2f] underline">
            {betaCtaLabel}
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
