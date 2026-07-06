import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">About MadeInVT</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Supporting Vermont&apos;s Makers</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            MadeInVT is a Vermont-based editorial platform celebrating the artisans, studios, and makers who shape the state&apos;s creative identity — through original storytelling, beautiful photography, and a deep commitment to craft.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Mission</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Make it easier to discover Vermont&apos;s makers, studios, workshops, and handcrafted goods — and to tell their stories with the depth they deserve.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">How MadeInVT Works</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Our editorial system curates makers, collections, events, and gift guides into practical discovery paths — each one grounded in original reporting and genuine Vermont craftsmanship.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Meet the Founder</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">MadeInVT was founded by Alex to spotlight Vermont&apos;s maker community through better storytelling, studio profiles, and handcraft-focused editorial coverage.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Original Photography</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Photography direction highlights workbenches, hands at work, finished pieces, and the studio environments where Vermont craftsmanship happens.</p>
          </article>
        </section>

        <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Community &amp; Craft</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Every maker profile, collection, and story we publish strengthens the Vermont maker community. We prioritize independent artisans, small studios, and the local economy that sustains them.</p>
        </section>
      </section>
      <Footer />
    </main>
  );
}
