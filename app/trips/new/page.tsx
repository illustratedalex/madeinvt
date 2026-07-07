import type { Metadata } from "next";
import { FeatureGate } from "@/components/FeatureGate";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ComingSoon } from "@/components/public/ComingSoon";
import { TripBuilder } from "@/components/public/TripBuilder";
import { getCollections } from "@/lib/repositories/collectionRepository";
import hiddenGems from "@/data/hidden-gems.json";
import { getPlaces } from "@/repositories/PlaceRepository";

export const metadata: Metadata = {
  title: "Gift Finder | MadeInVT",
  description: "Build a curated maker discovery list with studios, collections, and hidden gems.",
};

export default async function NewTripPage() {
  const [allPlaces, allCollections] = await Promise.all([getPlaces(), getCollections()]);
  const places = allPlaces.filter((place) => place.status === "published");
  const collections = allCollections.filter((collection) => collection.status === "published");

  const normalizedHiddenGems = hiddenGems.map((gem) => ({
    id: gem.id,
    name: gem.name,
    blurb: gem.blurb,
    location: gem.location,
  }));

  return (
    <FeatureGate
      flag="aiPlanner"
      fallback={
        <ComingSoon
          title="AI Gift Finder Is Coming Soon"
          description="Discovery intelligence is being tuned for better recommendation logic, preferences, and pacing."
          eyebrow="AI Planner"
        />
      }
    >
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Gift Finder</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Build your perfect MadeInVT maker list.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Tell us your preferences and generate a curated list with makers, hidden gems, collection guides, and planning tools.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <TripBuilder places={places} collections={collections} hiddenGems={normalizedHiddenGems} />
      </section>

      <Footer />
    </main>
    </FeatureGate>
  );
}
