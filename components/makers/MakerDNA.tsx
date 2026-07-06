import { CraftCard } from "@/components/makers/CraftCard";
import { GalleryCard } from "@/components/makers/GalleryCard";
import { MakerHighlights } from "@/components/makers/MakerHighlights";
import { MakerStory } from "@/components/makers/MakerStory";
import { MaterialsCard } from "@/components/makers/MaterialsCard";
import { WorkshopCard } from "@/components/makers/WorkshopCard";
import type { MakerDNA as MakerDNAType } from "@/types/MakerDNA";

type MakerDNAProps = {
  dna: MakerDNAType | null;
};

export function MakerDNA({ dna }: MakerDNAProps) {
  if (!dna) {
    return (
      <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Maker DNA</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Editorial Maker Profile</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This maker profile is still being assembled. Maker DNA appears here as editorial storytelling is published.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Maker DNA</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{dna.maker}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">An editorial profile focused on craft, process, story, and relationships.</p>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <CraftCard craft={dna.craft} specialties={dna.specialties} techniques={dna.techniques} />
        <MaterialsCard materials={dna.materials} />
        <WorkshopCard
          ships={dna.ships}
          workshopVisits={dna.workshopVisits}
          customOrders={dna.customOrders}
          apprentices={dna.apprentices}
          yearsCrafting={dna.yearsCrafting}
        />
        <GalleryCard gallery={dna.gallery} />
      </div>

      <div className="mt-5 space-y-5">
        <MakerStory story={dna.story} />
        <MakerHighlights
          products={dna.products}
          customerExperiences={dna.customerExperiences}
          collections={dna.collections}
          events={dna.events}
          relationships={dna.relationships}
        />
      </div>
    </section>
  );
}
