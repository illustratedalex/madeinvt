import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createPageMetadata } from "@/lib/seo";
import { vermont100Makers } from "@/data/vermont100Makers";

type MakersPageProps = {
  searchParams: Promise<{
    craft?: string;
    town?: string;
    region?: string;
    ships?: string;
    studioVisits?: string;
    customOrders?: string;
    status?: string;
  }>;
};

const PROFILE_PROGRESS_COPY = "MadeInVT profile in progress. Details may be incomplete.";

export const metadata: Metadata = createPageMetadata({
  title: "Vermont Makers Directory | MadeInVT",
  description: "Browse Vermont's maker directory with craft, town, region, and editorial-status filters.",
  path: "/makers",
});

function normalizeToggle(value: string | undefined) {
  if (value === "yes" || value === "no") return value;
  return "all";
}

function toggleMatches(value: boolean, filter: string) {
  if (filter === "all") return true;
  return filter === "yes" ? value : !value;
}

export default async function MakersPage({ searchParams }: MakersPageProps) {
  const params = await searchParams;
  const selectedCraft = params.craft?.trim() || "All";
  const selectedTown = params.town?.trim() || "All";
  const selectedRegion = params.region?.trim() || "All";
  const shipsFilter = normalizeToggle(params.ships);
  const studioVisitsFilter = normalizeToggle(params.studioVisits);
  const customOrdersFilter = normalizeToggle(params.customOrders);
  const selectedStatus = params.status?.trim() || "All";

  const allMakers = [...vermont100Makers];
  const crafts = [...new Set(allMakers.map((maker) => maker.craft).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const towns = [...new Set(allMakers.map((maker) => maker.town).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const regions = [...new Set(allMakers.map((maker) => maker.region).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const filteredMakers = allMakers.filter((maker) => {
    const craftMatch = selectedCraft === "All" || maker.craft === selectedCraft;
    const townMatch = selectedTown === "All" || maker.town === selectedTown;
    const regionMatch = selectedRegion === "All" || maker.region === selectedRegion;
    const shipsMatch = toggleMatches(maker.ships, shipsFilter);
    const studioVisitsMatch = toggleMatches(maker.studioVisits, studioVisitsFilter);
    const customOrdersMatch = toggleMatches(maker.customOrders, customOrdersFilter);
    const statusMatch = selectedStatus === "All" || maker.editorialStatus === selectedStatus;
    return craftMatch && townMatch && regionMatch && shipsMatch && studioVisitsMatch && customOrdersMatch && statusMatch;
  });

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="border-b border-[#d7cbb3] bg-[#10261e] py-14 text-[#f8f2e4]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">MadeInVT Directory</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Vermont Makers</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-200">
            Discover the public maker directory sourced from our Vermont 100 Makers editorial catalog.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <form className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm" action="/makers" method="get">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Filters</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Craft</span>
              <select name="craft" defaultValue={selectedCraft} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="All">All</option>
                {crafts.map((craft) => (
                  <option key={craft} value={craft}>
                    {craft}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Town</span>
              <select name="town" defaultValue={selectedTown} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="All">All</option>
                {towns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Region</span>
              <select name="region" defaultValue={selectedRegion} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="All">All</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Editorial Status</span>
              <select name="status" defaultValue={selectedStatus} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="All">All</option>
                <option value="Published">Published</option>
                <option value="Research">Research</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Ships</span>
              <select name="ships" defaultValue={shipsFilter} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Studio Visits</span>
              <select name="studioVisits" defaultValue={studioVisitsFilter} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Custom Orders</span>
              <select name="customOrders" defaultValue={customOrdersFilter} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <div className="flex items-end">
              <button type="submit" className="w-full rounded-xl bg-[#1f5a3d] px-4 py-2.5 text-sm font-semibold text-white">
                Apply Filters
              </button>
            </div>
          </div>
        </form>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-3xl font-semibold text-slate-900">All Makers</h2>
            <p className="text-sm text-slate-600">{filteredMakers.length} result{filteredMakers.length === 1 ? "" : "s"}</p>
          </div>

          {filteredMakers.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMakers.map((maker) => {
                const incomplete = !maker.studio || !maker.town || !maker.region || maker.editorialStatus !== "Published";
                return (
                  <article key={maker.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">{maker.editorialStatus}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{maker.makerName}</h3>
                    <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Studio:</span> {maker.studio || "—"}</p>
                    <p className="mt-1 text-sm text-slate-700"><span className="font-semibold">Town:</span> {maker.town || "—"}</p>
                    <p className="mt-1 text-sm text-slate-700"><span className="font-semibold">Craft:</span> {maker.craft}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${maker.ships ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        Ships: {maker.ships ? "Yes" : "No"}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${maker.studioVisits ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        Studio Visits: {maker.studioVisits ? "Yes" : "No"}
                      </span>
                    </div>
                    {incomplete ? <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{PROFILE_PROGRESS_COPY}</p> : null}
                    <Link href={`/makers/${maker.slug}`} className="mt-4 inline-flex rounded-full bg-[#1f5a3d] px-4 py-2 text-sm font-semibold text-white">
                      View Maker
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e8dfc8] bg-white p-6 text-sm text-slate-600">
              No makers match your current filters.
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}
