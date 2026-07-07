# Publication Config Audit

Date: 2026-07-06  
Scope: Audit remaining hardcoded publication-specific values that should eventually move into `config/publication.ts` and `config/publications/*`.

## Current status

- `config/publication.ts` exists and defines a reusable `PublicationConfig` contract.
- `config/publications/madeinvt.ts` and `config/publications/southernvt.ts` are populated.
- Runtime is **not wired** to use these configs yet; publication values are still duplicated in app/components/lib.

---

## 1) Values already represented in `config/publications/madeinvt.ts`

Represented categories:

- Site identity
  - `siteName`: `MadeInVT`
  - `tagline`: `Made by Vermonters. Shared with the World.`
- Theme/colors
  - Palette: Warm Linen, Walnut, Copper, Charcoal, Cream
  - Background/foreground tokens
- Entity vocabulary
  - `primaryEntity`: `Maker`
  - `secondaryEntity`: `Studio`
- Navigation model
  - Top-level groups and dropdown labels (Explore, Makers, Stories, Shop)
- Homepage model
  - Hero title/subtitle
  - Section list (Featured Maker, Maker Stories, etc.)
- Brand
  - Voice + typography
- Emails
  - `hello@madeinvt.com`, `partners@madeinvt.com`, `press@madeinvt.com`
- Social links
  - Placeholder `#` values
- SEO
  - Publication-level title + description

---

## 2) Values already represented in `config/publications/southernvt.ts`

Represented categories:

- Site identity
  - `siteName`: `SouthernVT`
  - Travel tagline
- Theme/colors
  - Forest Green / Maple Gold / Cream / Slate palette
- Entity vocabulary
  - `primaryEntity`: `Place`
  - `secondaryEntity`: `Business`
- Navigation model
  - Explore / Guides / Directory + travel labels
- Homepage model
  - Travel hero + section labels
- Brand
  - Regional travel publication voice
- Emails
  - `hello@southernvt.com`, `partners@southernvt.com`, `press@southernvt.com`
- Social links
  - Placeholder `#` values
- SEO
  - Publication-level title + description

---

## 3) Hardcoded MadeInVT values still in components/pages

### Site title / tagline / brand name

- `components/Navbar.tsx`
  - `MadeInVT`
  - `Vermont makers & artisans`
- `components/Footer.tsx`
  - `© 2026 MadeInVT`
  - `Made by Vermonters. Shared with the World.`
  - Long maker-focused footer description
- `app/layout.tsx`
  - Root metadata title/description hardcoded

### Hero copy and homepage publication language

- `app/page.tsx`
  - Hardcoded hero eyebrow/title/value props
  - Hardcoded CTA labels (`Explore Makers`, `Gift Guides`, `Meet the Makers`, `Find Handmade`)
  - Hardcoded featured-card label/body (`Meet This Week's Maker`, etc.)
  - Hardcoded section headlines/descriptions across homepage
- `components/Hero.tsx`
  - Hardcoded maker hero copy and search placeholder text

### Nav labels / route labels

- `lib/navigation.ts`
  - Hardcoded nav labels and dropdown item labels
  - Hardcoded route labels including `Why Trust MadeInVT?` -> `/why-trust-southernvt`
- `components/Footer.tsx`
  - Hardcoded footer section labels and link labels
  - Duplicates route labels also present in `lib/navigation.ts`

### Emails

- `app/contact/page.tsx`
  - Hardcoded email cards:
    - `hello@madeinvt.com`
    - `partners@madeinvt.com`
    - `press@madeinvt.com`

### Social links

- `components/Footer.tsx`
  - Hardcoded social labels and placeholder hrefs (`#`)

### Colors

- `app/globals.css`
  - Hardcoded palette token values
- Multiple components (`Navbar`, `Footer`, `app/page.tsx`, etc.)
  - Hardcoded accent color hex values in class strings (not from publication config)

### SEO suffixes

- `lib/seo.ts`
  - Global `SITE_NAME = "MadeInVT"`
  - Metadata title suffix templates use `| MadeInVT` in helper fallbacks
- Many page files in `app/**/page.tsx`
  - Per-page metadata titles include `| MadeInVT` hardcoded

### Beta banner copy

- `components/public/BetaBanner.tsx`
  - Hardcoded copy:
    - `MadeInVT is currently in Public Beta...`
    - `Know an artisan we should feature? Let us know.`

---

## 4) Hardcoded SouthernVT values still present

### Public-facing legacy route labels / references

- `lib/navigation.ts`, `components/Footer.tsx`, `app/contact/page.tsx`
  - Link target still references legacy slug: `/why-trust-southernvt`
- `app/why-trust-southernvt/page.tsx`
  - Legacy route slug retained by design, but publication-specific naming remains in code

### Public page copy still containing SouthernVT/travel placeholders

- `app/not-found.tsx`
  - `Hamilton Falls` / `Jamaica State Park` links and copy
- `app/places/[slug]/page.tsx`
  - Extensive travel-specific SouthernVT metadata/copy (Hamilton Falls, Jamaica State Park, waterfall/trip language)

### Publication identity strings in non-public/admin/platform surfaces

- `components/admin/Sidebar.tsx`, `app/admin/page.tsx`
  - `SouthernVT` label hardcoded
- `app/partner-portal/page.tsx`
  - `partners@southernvt.com` and multiple `SouthernVT` mentions
- `components/basecamp/**`, `app/basecamp/**`, `lib/editorial/**`, `lib/repositories/mode.ts`
  - Multiple SouthernVT references in ops/editorial/admin strings
- `components/search/SearchProvider.tsx`, `components/search/GlobalSearch.tsx`
  - SouthernVT-based storage keys / popular-place defaults

---

## 5) Recommended extraction order

1. **Global publication identity + metadata helpers**
   - Extract site name/tagline/seo suffix from `lib/seo.ts`, `app/layout.tsx`, `lib/constants.ts`.
2. **Public navigation and footer labels**
   - Make `lib/navigation.ts` and `components/Footer.tsx` consume publication config.
3. **Public copy blocks**
   - Move beta banner copy, hero copy, and homepage section text into publication config/content maps.
4. **Contact/social/email blocks**
   - Drive contact cards + footer socials from publication config.
5. **Theme token mapping**
   - Map publication theme config to CSS variables (without removing existing design tokens yet).
6. **Legacy SouthernVT references in public pages**
   - Centralize or gate `/why-trust-southernvt` labels + remaining travel fallback text.
7. **Admin/Basecamp/platform strings**
   - Extract remaining SouthernVT literals in editorial/admin tools after public surfaces are stable.

---

## 6) Risk level by extraction

| Extraction area | Risk | Why |
|---|---|---|
| SEO/site identity helper extraction | Medium | Metadata is cross-cutting; can affect canonical/openGraph/title behavior site-wide. |
| Nav/footer label extraction | Medium | Shared IA changes can break links, UX, and route expectations if config shape mismatches. |
| Hero/homepage copy extraction | Low | Mostly presentational text; minimal logic coupling. |
| Beta banner/contact/social extraction | Low | Isolated UI strings and links with limited dependency graph. |
| Theme token extraction | Medium-High | CSS variable source changes can cause broad visual regressions. |
| Legacy public SouthernVT route-label cleanup | Medium | Route slugs intentionally preserved; label/redirect mistakes can break discoverability. |
| Admin/Basecamp SouthernVT string extraction | High | Broad surface area and deeper coupling to existing workflows and terminology. |

---

## Remaining hardcoded values (high-priority shortlist)

- Site-level identity and SEO suffix hardcoded in:
  - `app/layout.tsx`
  - `lib/seo.ts`
  - many `app/**/page.tsx` metadata titles
- Nav/footer labels and route labels hardcoded in:
  - `lib/navigation.ts`
  - `components/Footer.tsx`
- Beta banner copy hardcoded in:
  - `components/public/BetaBanner.tsx`
- Hero + homepage publication copy hardcoded in:
  - `app/page.tsx`
  - `components/Hero.tsx`
- Contact emails hardcoded in:
  - `app/contact/page.tsx`
- Legacy SouthernVT public references still visible in:
  - `app/not-found.tsx`
  - `app/places/[slug]/page.tsx`
  - `/why-trust-southernvt` route labels in nav/footer/contact
