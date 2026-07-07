import { Sidebar } from "@/components/admin";
import { BasecampMakerGalleryReviewClient } from "@/components/makers/BasecampMakerGalleryReviewClient";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Claims", href: "/basecamp/claims" },
  { label: "Maker Gallery Review", href: "/basecamp/maker-gallery", active: true },
  { label: "Settings", href: "/basecamp/settings" },
];

export default function BasecampMakerGalleryPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Basecamp</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Maker Gallery Review Queue</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
              Review uploaded maker gallery images before they are visible on public maker profiles.
            </p>
          </section>

          <BasecampMakerGalleryReviewClient />
        </main>
      </div>
    </div>
  );
}
