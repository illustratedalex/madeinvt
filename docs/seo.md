# SEO Foundation

## October 21, 2026 canonical repair

Production source was verified against deployment `dpl_Y1ceLR6Cehqo7KqVRfKa3jZBAbbD`,
commit `9b164d09166d6bd8e08a4ef31a76e2efadfd0ecf` on `develop`.
Public checks found a bare-host homepage canonical and 170 bare-host sitemap URLs,
while visitors resolve to HTTPS www and robots already advertises the www sitemap.
The shared helper normalizes either owned production host to `https://www.madeinvt.com`,
including legacy environment values, while preserving custom/preview origins.
The existing About page receives unique metadata and a sitemap entry.
Visible content, maker/product data, private routes, authentication, billing and
analytics instrumentation are unchanged. Hosted checks and live release evidence
must be verified separately; no indexing, ranking or traffic improvement is implied.
The existing media-upload smoke test failed on the unchanged production source
because it targeted a removed dialog. Its fixture now exercises the current
inline upload form with a mocked HTTP response, including file and metadata
assertions. No real media is uploaded and no media application code is changed.

## Metadata strategy

The public site uses centralized metadata helpers in [lib/seo.ts](../lib/seo.ts):

- `createPageMetadata()` for shared route-level metadata.
- `createPlaceMetadata()` for place detail pages.
- `createCollectionMetadata()` for collection detail pages.
- `createEventMetadata()` for event detail pages.
- `createArticleMetadata()` for guide/article detail pages.

Each helper returns a Next.js `Metadata` object with:

- `title`
- `description`
- `alternates.canonical`
- `openGraph`
- `twitter`

When a model includes `seoTitle` or `seoDescription`, those fields are used first.

## Sitemap generation

Sitemap is generated in [app/sitemap.ts](../app/sitemap.ts).

It includes:

- static public routes (`/`, `/places`, `/collections`, `/events`, `/guides`)
- published places
- published collections
- published events
- published guides/articles

Current implementation uses repository data (mock-backed today) and can move to Supabase-backed repositories later without changing sitemap shape.

## Robots rules

Robots config is in [app/robots.ts](../app/robots.ts).

Rules:

- Allow public crawling (`/`)
- Disallow internal/admin surfaces:
  - `/basecamp`
  - `/api`
  - `/admin`

Sitemap reference points to `/sitemap.xml`.

## JSON-LD

JSON-LD helpers are in [lib/jsonLd.ts](../lib/jsonLd.ts):

- `placeJsonLd()`
- `eventJsonLd()`
- `articleJsonLd()`
- `collectionJsonLd()`

Detail pages inject the corresponding JSON-LD script (`application/ld+json`) server-side.

## Future Search Console setup

Recommended next steps:

1. Set `NEXT_PUBLIC_SITE_URL` to production domain in each environment.
2. Verify domain ownership in Google Search Console and Bing Webmaster Tools.
3. Submit `/sitemap.xml` to both consoles.
4. Monitor indexing coverage and enhancement reports (structured data).
5. Add organization/sitewide JSON-LD and OG image generation.
6. Add automated smoke checks for metadata and sitemap output in CI.
