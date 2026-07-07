import Link from "next/link";
import { Container } from "@/components/ui";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const exploreLinks = [
  { label: "All Makers", href: "/makers" },
  { label: "Studios", href: "/businesses" },
  { label: "Collections", href: "/collections" },
  { label: "Gift Guides", href: "/gift-guides" },
  { label: "Events", href: "/events" },
  { label: "New Makers", href: "/makers?sort=new" },
];

const learnLinks = [
  { label: "Maker Stories", href: "/stories" },
  { label: "Behind the Bench", href: "/stories?category=Behind%20the%20Bench" },
  { label: "How We Choose Makers", href: "/our-coverage" },
  { label: "Why Trust MadeInVT", href: "/why-trust-southernvt" },
  { label: "Public Beta", href: "/updates" },
  { label: "About", href: "/about" },
];

const communityLinks = [
  { label: "Founding Makers", href: "/founding-partners" },
  { label: "Maker Portal", href: "/partner-portal" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--color-copper)/20 bg-(--color-walnut) px-6 py-12 text-(--color-cream) sm:px-8 lg:px-10">
      <Container>
        <div className="grid gap-10 border-b border-(--color-copper)/30 pb-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-12">
          <div className="space-y-5">
            <p className="text-xl font-semibold text-(--color-cream)">{SITE_NAME}</p>
            <p className="max-w-sm text-sm leading-7 text-(--color-warm-linen)">
              MadeInVT celebrates Vermont artisans, workshops, studios, and handcrafted products through original storytelling, beautiful photography, and authentic maker profiles.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/makers"
                className="inline-flex min-h-11 items-center rounded-full bg-(--color-copper) px-4 py-2.5 text-sm font-semibold text-(--color-cream) transition hover:opacity-90"
              >
                Explore Makers
              </Link>
              <Link
                href="/feedback?category=Suggest%20a%20Maker"
                className="inline-flex min-h-11 items-center rounded-full border border-(--color-copper)/60 px-4 py-2.5 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-copper)/15"
              >
                Suggest a Maker
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-(--color-warm-linen)">Explore</p>
            <ul className="space-y-2.5 text-sm text-(--color-warm-linen)">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-(--color-cream)">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-(--color-warm-linen)">Learn</p>
            <ul className="space-y-2.5 text-sm text-(--color-warm-linen)">
              {learnLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-(--color-cream)">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-(--color-warm-linen)">Community</p>
            <ul className="space-y-2.5 text-sm text-(--color-warm-linen)">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-(--color-cream)">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-(--color-warm-linen) sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE_NAME}</p>
          <p className="font-medium text-(--color-cream)">{SITE_TAGLINE}</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="MadeInVT Facebook" className="transition hover:text-(--color-cream)">
              Facebook
            </a>
            <a href="#" aria-label="MadeInVT Instagram" className="transition hover:text-(--color-cream)">
              Instagram
            </a>
            <a href="#" aria-label="MadeInVT YouTube" className="transition hover:text-(--color-cream)">
              YouTube
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
