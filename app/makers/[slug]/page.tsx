import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MakerDNA } from "@/components/makers/MakerDNA";
import { createPageMetadata } from "@/lib/seo";
import { vermont100Makers } from "@/data/vermont100Makers";
import type { MakerDNA as MakerDNAType } from "@/types/MakerDNA";

const PROFILE_PROGRESS_COPY = "MadeInVT profile in progress. Details may be incomplete.";

type MakerPageProps = {
  params: Promise<{ slug: string }>;
};

const materialHints: Record<string, string[]> = {
  Glass: ["Glass"],
  Pottery: ["Clay"],
  Ceramics: ["Clay"],
  Furniture: ["Wood"],
  Woodworking: ["Wood"],
  Jewelry: ["Metal"],
  Leather: ["Leather"],
  "Fiber Arts": ["Wool", "Cotton"],
  Quilting: ["Cotton"],
  Painting: ["Canvas", "Paint"],
  Photography: ["Print Paper"],
  Printmaking: ["Paper", "Ink"],
  Metalwork: ["Metal"],
  Blacksmith: ["Steel", "Iron"],
  "Knife Making": ["Steel", "Wood"],
  Maple: ["Maple Sap"],
  Chocolate: ["Cacao"],
  "Coffee Roasters": ["Coffee Beans"],
  Breweries: ["Malt", "Hops"],
  Distilleries: ["Grain"],
  "Cheese Makers": ["Milk"],
  "Soap Makers": ["Oils"],
  Candles: ["Wax"],
  "Home Decor": [],
  Toys: ["Wood"],
  "Musical Instruments": ["Wood", "Metal"],
};

export async function generateStaticParams() {
  return vermont100Makers.map((maker) => ({ slug: maker.slug }));
}

export async function generateMetadata({ params }: MakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const maker = vermont100Makers.find((entry) => entry.slug === slug);

  if (!maker) {
    return createPageMetadata({
      title: "Maker Not Found | MadeInVT",
      description: "This maker profile is not currently available.",
      path: `/makers/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${maker.makerName} | Vermont Maker Profile | MadeInVT`,
    description: `Read ${maker.makerName}'s MadeInVT maker profile, including craft focus, workshop details, collections, and editorial status.`,
    path: `/makers/${maker.slug}`,
    type: "article",
  });
}

function buildMakerDNA(slug: string): MakerDNAType {
  const maker = vermont100Makers.find((entry) => entry.slug === slug);
  if (!maker) {
    throw new Error(`Maker not found for slug: ${slug}`);
  }

  const related = vermont100Makers
    .filter((entry) => entry.id !== maker.id && (entry.category === maker.category || entry.region === maker.region))
    .slice(0, 4);

  const materials = materialHints[maker.category] ?? [];

  return {
    maker: maker.makerName,
    craft: maker.craft,
    specialties: [maker.category],
    materials,
    techniques: [],
    ships: maker.ships,
    workshopVisits: maker.studioVisits,
    customOrders: maker.customOrders,
    apprentices: null,
    yearsCrafting: maker.yearsCrafting,
    story: "",
    products: [],
    gallery: [],
    customerExperiences: maker.customerExperienceStatus === "Published" || maker.customerExperienceStatus === "Ready" ? ["Published customer experience stories available in editorial queue."] : [],
    collections: maker.collections.map((name, index) => ({ id: `${maker.id}-collection-${index + 1}`, title: name, href: "/collections" })),
    events: [],
    relationships: related.map((entry) => ({ label: entry.makerName, href: `/makers/${entry.slug}` })),
  };
}

export default async function MakerProfilePage({ params }: MakerPageProps) {
  const { slug } = await params;
  const maker = vermont100Makers.find((entry) => entry.slug === slug);

  if (!maker) {
    notFound();
  }

  const makerDNA = buildMakerDNA(slug);
  const relatedMakers = vermont100Makers
    .filter((entry) => entry.id !== maker.id && (entry.category === maker.category || entry.region === maker.region))
    .slice(0, 6);
  const profileIncomplete = !maker.studio || !maker.town || !maker.region || !maker.website || maker.editorialStatus !== "Published";

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="border-b border-[#d7cbb3] bg-[#10261e] py-14 text-[#f8f2e4]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">Hero</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{maker.makerName}</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-200">
            {maker.craft}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{maker.studio || "Studio details pending"}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{maker.town || "Town pending"}{maker.region ? ` · ${maker.region}` : ""}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{maker.editorialStatus}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        {profileIncomplete ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {PROFILE_PROGRESS_COPY}
          </div>
        ) : null}

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Maker DNA</h2>
          <MakerDNA dna={makerDNA} />
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Story</h2>
          <p className="mt-3 text-sm leading-8 text-slate-700">
            {maker.storyStatus === "Published"
              ? `${maker.makerName}'s story is published in our editorial queue.`
              : PROFILE_PROGRESS_COPY}
          </p>
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Craft / Materials / Techniques</h2>
          <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">Craft:</span> {maker.craft}</p>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Materials:</span> {makerDNA.materials.length ? makerDNA.materials.join(", ") : "Not yet documented"}</p>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Techniques:</span> {makerDNA.techniques.length ? makerDNA.techniques.join(", ") : "Not yet documented"}</p>
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Workshop</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <p className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm"><span className="font-semibold">Workshop:</span> {maker.workshop ? "Yes" : "No"}</p>
            <p className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm"><span className="font-semibold">Studio Visits:</span> {maker.studioVisits ? "Yes" : "No"}</p>
            <p className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm"><span className="font-semibold">Ships:</span> {maker.ships ? "Yes" : "No"}</p>
            <p className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm"><span className="font-semibold">Custom Orders:</span> {maker.customOrders ? "Yes" : "No"}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Gallery</h2>
            <p className="mt-3 text-sm text-slate-700">{PROFILE_PROGRESS_COPY}</p>
          </section>
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
            <p className="mt-3 text-sm text-slate-700">{PROFILE_PROGRESS_COPY}</p>
          </section>
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Customer Experiences</h2>
          <p className="mt-3 text-sm text-slate-700">
            Current status: <span className="font-semibold">{maker.customerExperienceStatus}</span>
          </p>
          {maker.customerExperienceStatus === "Published" || maker.customerExperienceStatus === "Ready" ? null : (
            <p className="mt-2 text-sm text-slate-700">{PROFILE_PROGRESS_COPY}</p>
          )}
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Related Makers</h2>
          {relatedMakers.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedMakers.map((entry) => (
                <Link key={entry.id} href={`/makers/${entry.slug}`} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 transition hover:border-[#d7cbb3] hover:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1f5a3d]">{entry.category}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{entry.makerName}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.town || "Town pending"}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-700">{PROFILE_PROGRESS_COPY}</p>
          )}
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Events</h2>
          <p className="mt-3 text-sm text-slate-700">
            Event features are published through the editorial calendar and maker event queue.
          </p>
          <p className="mt-2 text-sm text-slate-700">{PROFILE_PROGRESS_COPY}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Collections</h2>
            <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">Collections:</span> {maker.collections.length ? maker.collections.join(", ") : "Not yet assigned"}</p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Gift Guides:</span> {maker.giftGuides.length ? maker.giftGuides.join(", ") : "Not yet assigned"}</p>
          </section>
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Contact / Website</h2>
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-semibold">Website:</span>{" "}
              {maker.website ? (
                <a href={maker.website} className="underline underline-offset-4">
                  {maker.website}
                </a>
              ) : (
                "Not listed"
              )}
            </p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Contact:</span> {maker.contactEmail || "Not listed"}</p>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
}
