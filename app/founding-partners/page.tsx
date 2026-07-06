import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { EditorialSection, Prose } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { foundingPartnerPublicSlots } from "@/data/foundingPartners";
import { FoundingPartnerBenefits, FoundingPartnerCTA, FoundingPartnerHero, FoundingPartnerPromise, FoundingPartnerSlots } from "@/components/founding-partners";

export const metadata = createPageMetadata({
  title: "MadeInVT Founding Makers",
  description: "A small founding partner program for local businesses that want to support MadeInVT's early growth.",
  path: "/founding-partners",
});

export default function FoundingPartnersPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <FoundingPartnerHero
          title="MadeInVT Founding Makers"
          headline="Help Build the Guide to Vermont"
          subheadline="We’re inviting a small group of local businesses to help shape MadeInVT from the beginning."
        />

        <EditorialSection
          eyebrow="What it is"
          title="A local support program for early growth"
          description="MadeInVT is a locally built maker publication. Founding Makers help support early growth, with the goal of better stories, better visibility, and better tools for local studios."
        >
          <Prose>
            <p>We’re building MadeInVT with the same care we want to bring to every maker and studio we feature.</p>
            <p>Founding Makers help fund the first stages of that work and stay close to the product while it grows.</p>
          </Prose>
        </EditorialSection>

        <FoundingPartnerBenefits />

        <FoundingPartnerPromise />

        <EditorialSection
          eyebrow="Simple founding offer"
          title="Founding Maker contribution"
          description="$50/month or $500/year during beta. The Founding Maker rate is locked in for early supporters."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f5a3d]">Monthly</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">$50</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">A simple way to support MadeInVT during beta with a predictable monthly contribution.</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f5a3d]">Annual</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">$500</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">A discounted yearly contribution for early supporters who want to lock in the founding rate.</p>
            </article>
          </div>
        </EditorialSection>

        <FoundingPartnerSlots
          filled={foundingPartnerPublicSlots.filled}
          total={foundingPartnerPublicSlots.total}
          label="Founding Maker spots filled"
          caption="A small cohort keeps the program personal and aligned with local businesses from the start."
        />

        <FoundingPartnerCTA />
      </section>

      <Footer />
    </main>
  );
}