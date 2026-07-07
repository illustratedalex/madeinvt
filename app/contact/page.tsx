import { Suspense } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactInquiryForm from "@/components/public/ContactInquiryForm";
import { EditorialSection } from "@/components/ui";
import { madeInVTConfig } from "@/config/publications/madeinvt";
import { createPageMetadata } from "@/lib/seo";

const siteName = madeInVTConfig.siteName || "MadeInVT";
const contactEmails = {
  hello: madeInVTConfig.emails?.hello || "hello@madeinvt.com",
  partners: madeInVTConfig.emails?.partners || "partners@madeinvt.com",
  press: madeInVTConfig.emails?.press || "press@madeinvt.com",
};

export const metadata = createPageMetadata({
  title: `Contact ${siteName} | Questions, Partnerships & Media`,
  description:
    `Get in touch with ${siteName} about maker suggestions, studio partnerships, media inquiries, and Founding Partner opportunities.`,
  path: "/contact",
});

const contactCards = [
  {
    title: "General Questions",
    email: contactEmails.hello,
    description: "Questions, maker suggestions, listing corrections, and general inquiries.",
  },
  {
    title: "Founding Partners",
    email: contactEmails.partners,
    description: "Founding Partner opportunities, collaboration ideas, sponsorship discussions, and studio partnerships.",
  },
  {
    title: "Press & Media",
    email: contactEmails.press,
    description: "Interviews, media requests, podcasts, speaking engagements, and editorial inquiries.",
  },
];

const quickActions = [
  { label: "Suggest a Maker", href: "/feedback?category=Missing%20Place" },
  { label: "Claim a Listing", href: "/businesses" },
  { label: "Founding Partners", href: "/founding-partners" },
  { label: "Our Coverage", href: "/our-coverage" },
  { label: "Why Trust MadeInVT", href: "/why-trust-southernvt" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <EditorialSection
          eyebrow="Contact MadeInVT"
          title="Let&apos;s Start a Conversation"
          description="Whether you&apos;ve discovered a Vermont maker we should feature, found an incorrect listing, want to partner with MadeInVT, or simply have a story to share, we&apos;d love to hear from you."
          headingLevel="h1"
        >
          <div className="overflow-hidden rounded-[26px] border border-[#d8c7a0] bg-[linear-gradient(125deg,#f4dfb0,#d7b274_45%,#8ea188)] p-6 text-[#173325] shadow-[0_20px_60px_rgba(31,59,47,0.16)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.24em] text-[#274737]">{siteName} Editorial Desk</p>
            <p className="mt-2 max-w-2xl text-lg font-medium leading-8">
              We respond to destination tips, listing corrections, business partner questions, and media requests.
            </p>
          </div>
        </EditorialSection>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <EditorialSection
            eyebrow="Who You&apos;re Contacting"
            title="Meet the Editor"
            description={`${siteName} combines editorial craft, photography, and deep roots in Vermont's maker community to create the most trusted guide to Vermont artisans.`}
          >
            <div className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <p className="text-2xl font-semibold text-slate-900">Alex Lawrence</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Founder &amp; Editor-in-Chief</p>
              <p className="mt-1 text-sm text-slate-600">{siteName}</p>
            </div>
          </EditorialSection>

          <EditorialSection
            eyebrow="Our Promise"
            title="Authentic Vermont craftsmanship storytelling"
            description={`${siteName} exists to tell authentic stories, support local makers, and help people discover the best of Vermont handcraft through editorial independence, original photography, and thoughtful recommendations.`}
          />
        </section>

        <EditorialSection eyebrow="Email Desks" title="Contact the right editorial desk">
          <div className="grid gap-4 md:grid-cols-3">
            {contactCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-[#dcc9a1] bg-[linear-gradient(170deg,#fffef8_0%,#faf3e4_100%)] p-5 shadow-[0_15px_35px_rgba(31,59,47,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5a3d]">{card.title}</p>
                <a href={`mailto:${card.email}`} className="mt-2 inline-block text-base font-semibold text-slate-900 underline underline-offset-2">
                  {card.email}
                </a>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </EditorialSection>

        <Suspense fallback={<div className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Loading contact form…</p></div>}>
          <ContactInquiryForm />
        </Suspense>

        <EditorialSection eyebrow="Quick Links" title={`Popular ${siteName} destinations`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </EditorialSection>
      </section>
      <Footer />
    </main>
  );
}
