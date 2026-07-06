"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/admin";
import { vermont100Makers } from "@/data/vermont100Makers";
import type { Vermont100Maker } from "@/types/Vermont100Maker";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue" },
  { label: "Vermont 100 Makers", href: "/basecamp/vermont-100-makers", active: true },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Makers", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
];

type FilterValue = "All" | string;
type QuickAction = "assign" | "interview" | "publish" | "ready";

function cloneMaker(maker: Vermont100Maker): Vermont100Maker {
  return {
    ...maker,
    collections: [...maker.collections],
    giftGuides: [...maker.giftGuides],
  };
}

function boolPill(value: boolean) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        value ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function Vermont100MakersPage() {
  const [makers, setMakers] = useState(() => vermont100Makers.map(cloneMaker));
  const [selectedId, setSelectedId] = useState(makers[0]?.id ?? null);
  const [regionFilter, setRegionFilter] = useState<FilterValue>("All");
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>("All");
  const [editorialFilter, setEditorialFilter] = useState<FilterValue>("All");
  const [priorityFilter, setPriorityFilter] = useState<FilterValue>("All");

  const selectedMaker = useMemo(() => makers.find((maker) => maker.id === selectedId) ?? null, [makers, selectedId]);
  const regions = useMemo(() => [...new Set(makers.map((maker) => maker.region).filter(Boolean))].sort(), [makers]);
  const categories = useMemo(() => [...new Set(makers.map((maker) => maker.category))].sort(), [makers]);
  const priorities = useMemo(() => [...new Set(makers.map((maker) => maker.priority))].sort(), [makers]);
  const editorialStates = useMemo(() => [...new Set(makers.map((maker) => maker.editorialStatus))].sort(), [makers]);

  const filteredMakers = useMemo(() => {
    return makers.filter((maker) => {
      if (regionFilter !== "All" && maker.region !== regionFilter) return false;
      if (categoryFilter !== "All" && maker.category !== categoryFilter) return false;
      if (editorialFilter !== "All" && maker.editorialStatus !== editorialFilter) return false;
      if (priorityFilter !== "All" && maker.priority !== priorityFilter) return false;
      return true;
    });
  }, [makers, regionFilter, categoryFilter, editorialFilter, priorityFilter]);

  const stats = useMemo(() => {
    const published = makers.filter((maker) => maker.editorialStatus === "Published").length;
    const research = makers.filter((maker) => maker.editorialStatus === "Research").length;
    const photography = makers.filter((maker) => maker.editorialStatus === "Photography" || maker.galleryStatus === "Published" || maker.galleryStatus === "Ready").length;
    const interviews = makers.filter((maker) => maker.editorialStatus === "Interview").length;
    return { total: makers.length, published, research, photography, interviews };
  }, [makers]);

  function applyQuickAction(action: QuickAction) {
    if (!selectedId) return;

    setMakers((current) =>
      current.map((maker) => {
        if (maker.id !== selectedId) {
          return maker;
        }

        if (action === "assign") {
          return { ...maker, priority: "Critical", editorialStatus: "Research", storyStatus: "In Progress" };
        }

        if (action === "interview") {
          return { ...maker, editorialStatus: "Interview", storyStatus: "In Progress", customerExperienceStatus: "In Progress" };
        }

        if (action === "ready") {
          return { ...maker, editorialStatus: "Ready", storyStatus: "Ready", galleryStatus: "Ready", customerExperienceStatus: "Ready" };
        }

        return { ...maker, editorialStatus: "Published", storyStatus: "Published", galleryStatus: "Published", customerExperienceStatus: "Published" };
      }),
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Editor-in-Chief Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vermont 100 Makers</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              Master editorial catalog for MadeInVT. Every featured maker profile is planned, tracked, and published from this workspace.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Overall Progress</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.published} / 100</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">100 Makers</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Published</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.published}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Research</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.research}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Photography / Interviews</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stats.photography} / {stats.interviews}
              </p>
            </article>
          </section>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Filters</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Region</span>
                <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {regions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Category</span>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {categories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Editorial Status</span>
                <select value={editorialFilter} onChange={(event) => setEditorialFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {editorialStates.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Priority</span>
                <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {priorities.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Quick Actions</p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedMaker ? `Selected: ${selectedMaker.makerName}` : "Select a maker row to apply quick editorial actions."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => applyQuickAction("assign")} disabled={!selectedMaker} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  Assign
                </button>
                <button type="button" onClick={() => applyQuickAction("interview")} disabled={!selectedMaker} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  Interview
                </button>
                <button type="button" onClick={() => applyQuickAction("ready")} disabled={!selectedMaker} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  Mark Ready
                </button>
                <button type="button" onClick={() => applyQuickAction("publish")} disabled={!selectedMaker} className="rounded-full bg-[#1f5a3d] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                  Publish
                </button>
                <Link
                  href={selectedMaker ? `/search?q=${encodeURIComponent(selectedMaker.makerName)}` : "#"}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    selectedMaker ? "border-[#d7cbb3] bg-white text-slate-800" : "pointer-events-none border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Open
                </Link>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[1900px] divide-y divide-[#ece3cf] text-sm">
                <thead className="bg-[#fcfaf6]">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Maker Name</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Studio</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Town</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Region</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Craft</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Category</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Priority</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Editorial Status</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Story</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Gallery</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Customer Experience</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Collections</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Gift Guides</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Workshop</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Ships</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Online Store</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Studio Visits</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Years Crafting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ebda]">
                  {filteredMakers.map((maker) => (
                    <tr
                      key={maker.id}
                      onClick={() => setSelectedId(maker.id)}
                      className={`cursor-pointer align-top ${selectedId === maker.id ? "bg-[#f3f8f4]" : "bg-white hover:bg-[#fdf8ef]"}`}
                    >
                      <td className="px-3 py-3 font-semibold text-slate-900">{maker.makerName}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.studio || "—"}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.town || "—"}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.region || "—"}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.craft}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.category}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.priority}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.editorialStatus}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.storyStatus}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.galleryStatus}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.customerExperienceStatus}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.collections.length ? maker.collections.join(", ") : "—"}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.giftGuides.length ? maker.giftGuides.join(", ") : "—"}</td>
                      <td className="px-3 py-3">{boolPill(maker.workshop)}</td>
                      <td className="px-3 py-3">{boolPill(maker.ships)}</td>
                      <td className="px-3 py-3">{boolPill(maker.onlineStore)}</td>
                      <td className="px-3 py-3">{boolPill(maker.studioVisits)}</td>
                      <td className="px-3 py-3 text-slate-700">{maker.yearsCrafting ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
