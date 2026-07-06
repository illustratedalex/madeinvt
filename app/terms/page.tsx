import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Use — MadeInVT",
  description: "Terms and launch-use conditions for MadeInVT public beta.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-10">
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Terms of Use</h1>
          <p className="mt-2 text-sm text-slate-500">Effective Date: July 2026</p>

          <Section title="About MadeInVT">
            <p>
              MadeInVT is a Vermont editorial platform celebrating artisans, makers, workshops, and handcrafted products.
              We publish maker profiles, studio listings, stories, events, collections, and gift guides to help people
              discover Vermont craftsmanship.
            </p>
          </Section>

          <Section title="Information May Change">
            <p>
              Maker and studio information can change without notice. Listings, details, and profiles may be updated,
              moved, paused, or removed as conditions change.
            </p>
            <p>
              Some listings are intentionally basic during beta launch, and details may be incomplete.
            </p>
          </Section>

          <Section title="Verify Before You Visit">
            <p>Before visiting a maker or studio, users should independently verify important details, including:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Hours and seasonal operating windows</li>
              <li>Studio visit policies and booking requirements</li>
              <li>Access and parking details</li>
              <li>Product availability</li>
            </ul>
          </Section>

          <Section title="Studio Listings and Claims">
            <p>
              Makers and studio owners may claim listings to request updates and improve listing accuracy.
              Submitted claims and requested updates may be reviewed before publication.
            </p>
          </Section>

          <Section title="Editorial Independence and Trust">
            <p>
              Editorial recommendations and verification are not for sale.
              Paid support, subscriptions, or partnership programs do not purchase editorial recommendations,
              rankings, or verification outcomes.
            </p>
          </Section>

          <Section title="User-Submitted Content">
            <p>
              MadeInVT may accept user-submitted suggestions, corrections, and related content.
              Submissions may be reviewed, edited, deferred, or declined before publishing.
            </p>
          </Section>

          <Section title="No Warranty">
            <p>
              MadeInVT content is provided for general informational purposes only.
              We do not guarantee availability, accuracy, completeness, reliability, or suitability for every use case.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:hello@madeinvt.com" className="font-semibold text-[#1f3b2f] underline underline-offset-2">
                hello@madeinvt.com
              </a>
              .
            </p>
          </Section>
        </article>
      </section>
      <Footer />
    </main>
  );
}
