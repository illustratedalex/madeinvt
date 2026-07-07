"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampSection, BasecampToolbar } from "@/components/basecamp";
import { addSessionActivityEvent } from "@/lib/basecamp/sessionEvents";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { getClaims, updateClaimStatus } from "@/lib/repositories/claimRepository";
import type { BusinessClaim } from "@/types/Claim";
import { ClaimDetailsDrawer } from "./ClaimDetailsDrawer";
import { ClaimTable } from "./ClaimTable";

type ClaimQueueFilter = "all" | "pending" | "approved" | "rejected" | "needs_follow_up";

function requiresFollowUp(claim: BusinessClaim): boolean {
  const combinedNotes = `${claim.reviewNotes ?? ""} ${claim.verificationNotes} ${claim.requestedUpdates}`.toLowerCase();
  const noteFlag = /follow[-\s]?up|need(s)?\s+more|missing|clarif/i.test(combinedNotes);
  if (noteFlag) {
    return true;
  }
  if (claim.status !== "pending") {
    return false;
  }
  const submittedMs = Date.parse(claim.submittedAt);
  if (Number.isNaN(submittedMs)) {
    return false;
  }
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - submittedMs >= sevenDaysMs;
}

export function BasecampClaimsClient() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [selected, setSelected] = useState<BusinessClaim | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimQueueFilter>("all");
  const [businessPortalEnabled, setBusinessPortalEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [loadedClaims, enabled] = await Promise.all([getClaims(), isFeatureEnabled("businessPortal")]);
        setClaims(loadedClaims);
        setBusinessPortalEnabled(enabled);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load claims.");
      }
    }

    void load();
  }, []);

  const refreshClaims = async () => {
    const loaded = await getClaims();
    setClaims(loaded);
  };

  const filteredClaims = useMemo(() => {
    if (statusFilter === "all") {
      return claims;
    }
    if (statusFilter === "needs_follow_up") {
      return claims.filter(requiresFollowUp);
    }
    return claims.filter((claim) => claim.status === statusFilter);
  }, [claims, statusFilter]);

  const visibleClaims = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return filteredClaims;
    }

    return filteredClaims.filter((claim) => {
      const haystack = `${claim.businessName} ${claim.contactName} ${claim.businessSlug} ${claim.email}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [filteredClaims, search]);

  const filterCounts = useMemo(
    () => ({
      all: claims.length,
      pending: claims.filter((claim) => claim.status === "pending").length,
      approved: claims.filter((claim) => claim.status === "approved").length,
      rejected: claims.filter((claim) => claim.status === "rejected").length,
      needs_follow_up: claims.filter(requiresFollowUp).length,
    }),
    [claims],
  );

  const transitionClaim = async (claim: BusinessClaim, status: "approved" | "rejected", reviewNotes?: string) => {
    try {
      const updated = await updateClaimStatus(claim.id, { status, reviewNotes, reviewedBy: "basecamp_claims" });

      addSessionActivityEvent({
        type: "status_changed",
        contentType: "workflow",
        contentId: claim.businessListingId,
        title: `${claim.businessName} ownership request ${status}.`,
        description: `${claim.businessName} claim moved to ${status}.`,
        actor: "Basecamp Claims",
        metadata: {
          businessSlug: claim.businessSlug,
          status,
          reviewNotes: reviewNotes ?? "",
        },
      });

      await refreshClaims();

      if (selected?.id === claim.id) {
        setSelected(updated);
      }
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to review claim.");
    }
  };

  return (
    <>
      <BasecampPageHeader
        eyebrow="Basecamp"
        title="Business Claims"
        description="Review and triage ownership requests for existing business listings."
        statusPill={businessPortalEnabled ? "Internal queue (auth pending)" : "Preview"}
        primaryAction={{ label: "Feature flags", href: "/basecamp/settings/features" }}
      />

      {!businessPortalEnabled ? (
        <BasecampEmptyState
          title="Business claiming is hidden"
          description="Enable the businessPortal flag to show claim links publicly and activate this queue."
          ctaLabel="Open feature flags"
          ctaHref="/basecamp/settings/features"
        />
      ) : (
        <>
          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</p>
          ) : null}

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search claims"
            sortLabel="Newest"
            viewLabel="Table"
            bulkLabel="Queue"
          />

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
              { id: "needs_follow_up", label: "Needs Follow-up" },
            ].map((filter) => {
              const isActive = statusFilter === filter.id;
              const count = filterCounts[filter.id as ClaimQueueFilter];
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id as ClaimQueueFilter)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]"
                      : "border-[#d7cbb3] bg-white text-slate-700 hover:bg-[#fcfaf6]"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20 text-white" : "bg-[#f6f0e4] text-slate-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <BasecampSection
            title="Claim queue"
            eyebrow="Business Portal"
            description="Pending, approved, rejected, and needs follow-up ownership requests."
          >
            {visibleClaims.length === 0 ? (
              <p className="text-sm leading-7 text-slate-600">No claims found for the current filter.</p>
            ) : (
              <ClaimTable
                claims={visibleClaims}
                onApprove={(id, reviewNotes) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "approved", reviewNotes);
                }}
                onReject={(id, reviewNotes) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "rejected", reviewNotes);
                }}
                onView={setSelected}
              />
            )}
          </BasecampSection>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 text-sm leading-7 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Workflow</p>
            <p className="mt-2">
              Pending {"->"} Approved {"->"} Owner access enabled
            </p>
            <p className="mt-1 text-slate-500">
              Approval creates an owner mapping record. Rejection keeps the listing unclaimed.
            </p>
            <p className="mt-1 text-slate-500">
              Approved claims are also linked automatically after signup/login when the account email matches the approved claim email.
            </p>
            <p className="mt-1 text-slate-500">
              Basecamp reviewer authentication is not fully implemented yet. This queue assumes trusted internal access.
            </p>
            <Link href="/basecamp/activity" className="mt-3 inline-flex font-semibold text-[#1f3b2f] underline underline-offset-4">
              View activity log
            </Link>
          </section>
        </>
      )}

      <ClaimDetailsDrawer
        key={selected?.id ?? "no-claim-selected"}
        claim={selected}
        onClose={() => setSelected(null)}
        onApprove={(id, reviewNotes) => {
          const claim = claims.find((item) => item.id === id);
          if (!claim) {
            return;
          }
          void transitionClaim(claim, "approved", reviewNotes);
        }}
        onReject={(id, reviewNotes) => {
          const claim = claims.find((item) => item.id === id);
          if (!claim) {
            return;
          }
          void transitionClaim(claim, "rejected", reviewNotes);
        }}
      />
    </>
  );
}
