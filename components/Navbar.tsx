import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchButton } from "@/components/search/SearchButton";
import { publicNavigationLinks } from "@/lib/navigation";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-pine)/15 bg-(--color-cream)/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-forest-green) text-sm font-semibold uppercase tracking-[0.24em] text-(--color-cream)">
            MV
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-(--color-forest-green)">
              MadeInVT
            </p>
            <p className="hidden text-xs text-slate-600 sm:block">Vermont makers &amp; artisans</p>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap pr-4 xl:flex">
          {publicNavigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-(--color-forest-green)">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <details className="relative xl:hidden">
            <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d8c9ad] bg-[#fcfaf6] text-[#1f3b2f] marker:content-none">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(90vw,22rem)] rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-[0_20px_60px_rgba(31,59,47,0.18)]">
              <div className="max-h-[70vh] space-y-4 overflow-auto pr-1">
                {publicNavigationLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#fcfaf6]">
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/concierge"
                  className="inline-flex w-full items-center justify-center rounded-full bg-(--color-forest-green) px-4 py-2.5 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-pine)"
                >
                  Maker Finder
                </Link>
              </div>
            </div>
          </details>
          <SearchButton />
          <Link
            href="/concierge"
            className="hidden rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold whitespace-nowrap text-(--color-cream) transition hover:bg-(--color-pine) lg:inline-flex"
          >
            Maker Finder
          </Link>
        </div>
      </Container>
    </header>
  );
}
