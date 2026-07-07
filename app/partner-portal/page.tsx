import Link from "next/link";
import { redirect } from "next/navigation";
import { OwnerListingEditRequestForm } from "@/components/partner/OwnerListingEditRequestForm";
import { billingPlans, getCurrentBillingPlanLabel, getSquareBillingStatus } from "@/lib/billing/plans";
import { getAuthenticatedOwnerUser } from "@/lib/auth/session";
import { getOwnedBusinessListings } from "@/lib/claims/liveClaims";
import { createPageMetadata } from "@/lib/seo";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata = createPageMetadata({
  title: "Maker Portal | MadeInVT",
  description: "Maker Portal access for approved maker and studio profile owners on MadeInVT.",
  path: "/partner-portal",
});

export default async function PartnerPortalLandingPage() {
  const authEnabled = hasSupabaseConfig();
  const user = await getAuthenticatedOwnerUser();
  if (!user) {
    redirect("/login?next=/partner-portal");
  }
  const ownedListings = user ? await getOwnedBusinessListings(user.id) : [];
  const squareStatus = getSquareBillingStatus();

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-14 sm:px-8 lg:px-10">
      <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Maker Portal</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Manage your MadeInVT presence</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          The Maker Portal gives approved makers and studios a review-based workflow for profile updates, events, stories, and photos.
        </p>
        {user ? (
          <form action="/logout" method="post" className="mt-6">
            <button type="submit" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-slate-700">
              Logout
            </button>
          </form>
        ) : null}
      </header>

      {!authEnabled ? (
        <article className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-amber-900">Accounts are not enabled yet</h2>
          <p className="mt-2 text-sm leading-7 text-amber-800">
            Public beta accounts are not enabled in this environment yet. Email{" "}
            <a href="mailto:partners@madeinvt.com" className="font-semibold underline underline-offset-2">
              partners@madeinvt.com
            </a>{" "}
            to request early access.
          </p>
        </article>
      ) : null}

      <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Billing &amp; upgrade path</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Current plan: {user && ownedListings[0] ? getCurrentBillingPlanLabel(ownedListings[0].isFoundingPartner, ownedListings[0].status) : "Free Basic Listing"}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Claiming a listing is free. Paid listing upgrades are structured for later launch, but they do not purchase editorial recommendations, verification, or rankings.
        </p>
        {!squareStatus.configured ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Online checkout is coming soon. Contact{" "}
            <a href="mailto:partners@madeinvt.com" className="font-semibold underline underline-offset-2">
              partners@madeinvt.com
            </a>{" "}
            to activate this plan.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
            Square is configured. Upgrade options are available on your listing upgrade page.
          </div>
        )}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {billingPlans.filter((plan) => plan.purchasable).map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{plan.name}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">${plan.price}/{plan.interval === "monthly" ? "mo" : "yr"}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{plan.trustNote}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">Owner access coming online</p>
        <h2 className="mt-2 text-xl font-semibold text-amber-900">Full maker profile management is rolling out now</h2>
        <p className="mt-3 text-sm leading-7 text-amber-800">
          Once your claim is approved, you&apos;ll be able to update your profile details, add photos, post events, and submit story updates directly through this portal.
        </p>
        <p className="mt-2 text-sm leading-7 text-amber-800">
          During public beta, claim approval and account-to-profile linking may still require manual support from our team.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:partners@madeinvt.com"
            className="inline-flex rounded-full bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900 transition"
          >
            Email partners@madeinvt.com
          </a>
          <Link
            href="/feedback?category=Suggest%20a%20Maker"
            className="inline-flex rounded-full border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-50 transition"
          >
            Claim or suggest a maker profile
          </Link>
        </div>
        <p className="mt-3 text-sm text-amber-900">Need help now? We can manually assist during public beta.</p>
      </div>

      {!user ? (
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Login to manage your listing</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Log in or create a free account to access your approved business listings. Approval is required before edit access is granted.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4]">
              Login
            </Link>
            <Link href="/signup" className="rounded-full border border-[#d7cbb3] px-5 py-2.5 text-sm font-semibold text-slate-700">
              Create account
            </Link>
          </div>
        </article>
      ) : null}

      {user && ownedListings.length === 0 ? (
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Pending</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">No approved maker profiles yet.</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Your claim may still be under review. MadeInVT manually reviews every claim before granting edit access.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/feedback?category=Suggest%20a%20Maker" className="rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4]">
              Claim or suggest a maker profile
            </Link>
            <a href="mailto:partners@madeinvt.com" className="rounded-full border border-[#d7cbb3] px-5 py-2.5 text-sm font-semibold text-slate-700">
              partners@madeinvt.com
            </a>
          </div>
        </article>
      ) : null}

      {user && ownedListings.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Your approved profiles</h2>
          {ownedListings.map((listing) => (
            <article key={listing.id} className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{listing.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{listing.town}, {listing.county}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {["Profile completeness", "Photos", "Story", "Events", "Customer Experiences", "Plan/Billing"].map((feature) => (
                  <div key={feature} className="rounded-xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-3 text-center">
                    <p className="text-xs font-semibold text-slate-700">{feature}</p>
                    <p className="mt-1 text-xs text-slate-400">Placeholder</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-900">Current plan</p>
                <p className="mt-1">{getCurrentBillingPlanLabel(listing.isFoundingPartner, listing.status)}</p>
                <p className="mt-2">
                  Upgrade path: Enhanced Listing for $25/month or $250/year, or Founding Partner for $50/month or $500/year.
                </p>
                <p className="mt-2">
                  Need help? Email{" "}
                  <a href="mailto:partners@madeinvt.com" className="font-semibold text-[#1f3b2f] underline underline-offset-2">
                    partners@madeinvt.com
                  </a>
                  .
                </p>
              </div>
              <OwnerListingEditRequestForm listing={listing} />
              <div className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-900">What owners cannot edit</p>
                <p className="mt-1">
                  Verification badges, editorial ranking, and final publication decisions are managed by the MadeInVT editorial team and cannot be changed by owners.
                </p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
