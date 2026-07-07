import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui";
import { AnalyticsTrackOnRender } from "@/components/analytics/AnalyticsTrackOnRender";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import { NextAdventureCard } from "@/components/discovery/NextAdventureCard";
import { RecommendedCollectionsRail } from "@/components/discovery/RecommendedCollectionsRail";
import { RecommendedEventsRail } from "@/components/discovery/RecommendedEventsRail";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { ReviewList } from "@/components/public/ReviewList";
import { MakerDNA } from "@/components/makers/MakerDNA";
import { BestTimeSection } from "@/components/story/BestTimeSection";
import { HistorySection } from "@/components/story/HistorySection";
import { LocalSecrets } from "@/components/story/LocalSecrets";
import { PhotographyTips } from "@/components/story/PhotographyTips";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryQuote } from "@/components/story/StoryQuote";
import { StorySidebar } from "@/components/story/StorySidebar";
import { StorySummary } from "@/components/story/StorySummary";
import { VisitorTips } from "@/components/story/VisitorTips";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { isBusinessPlaceType } from "@/lib/businessClaims";
import { buildClaimListingHref } from "@/lib/claims/claimListingUrl";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { placeJsonLd } from "@/lib/jsonLd";
import { getPlaceLayoutProfile } from "@/lib/places/placeLayoutProfiles";
import { getSuggestedNextStopsForPlace } from "@/lib/graph/RelationshipQueries";
import { getCoverageBadgeForPlace } from "@/lib/editorial/CoveragePolicy";
import { createPageMetadata, createPlaceMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaceBySlug, getPlaces } from "@/repositories/PlaceRepository";
import { getApprovedReviewsByPlaceId } from "@/repositories/ReviewRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import type { Place } from "@/types/Place";
import type { MakerDNA as MakerDNAType } from "@/types/MakerDNA";
import type { Story } from "@/types/Story";
import { PlacePassportCTA } from "@/components/public/PlacePassportCTA";
import { PlacePlanningCTA } from "@/components/public/PlacePlanningCTA";
import { TravelerExperiences } from "@/components/public/TravelerExperiences";
import { VerificationBadge } from "@/components/public/VerificationBadge";
import { VerificationPanel } from "@/components/public/VerificationPanel";
import { getVerificationByPlaceId } from "@/lib/repositories/VerificationRepository";

interface PlaceDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ upgrade?: string }>;
}

const MATERIAL_HINTS = [
  "wood",
  "maple",
  "metal",
  "glass",
  "leather",
  "textile",
  "fiber",
  "ceramic",
  "clay",
  "stone",
];

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))];
}

function inferMaterials(place: Place): string[] {
  const source = [...place.tags, ...place.categories, ...place.amenities];
  return unique(source.filter((value) => MATERIAL_HINTS.some((hint) => value.toLowerCase().includes(hint)))).slice(0, 8);
}

function buildMakerDNA(params: {
  place: Place;
  story: Story;
  customerExperiences: { title: string; body: string }[];
  collections: { id: string; title: string; slug: string }[];
  events: { id: string; title: string; slug: string }[];
  relationships: Place[];
}): MakerDNAType {
  const { place, story, customerExperiences, collections, events, relationships } = params;
  const materials = inferMaterials(place);
  const products = unique(
    [
      ...(place.metadata.shop?.products ? place.metadata.shop.products.split(",") : []),
      ...place.categories,
      ...place.tags.filter((tag) => tag.length <= 28),
    ].map((item) => item.trim()),
  ).slice(0, 8);
  const techniques = unique([...story.photographyTips, ...story.visitorTips, ...place.tags]).slice(0, 8);

  return {
    maker: place.name,
    craft: place.placeType,
    specialties: unique([...place.categories, ...place.tags]).slice(0, 8),
    materials,
    techniques,
    ships: place.metadata.shop?.shippingAvailable ?? false,
    workshopVisits: place.placeType === "Maker Studio" || place.placeType === "Shop",
    customOrders: place.tags.some((tag) => tag.toLowerCase().includes("custom")) || place.categories.some((category) => category.toLowerCase().includes("custom")),
    apprentices: null,
    yearsCrafting: null,
    story: story.summary,
    products,
    gallery: unique([place.featuredImage, ...place.gallery]).slice(0, 8),
    customerExperiences: customerExperiences.map((experience) => experience.title).slice(0, 6),
    collections: collections.map((collection) => ({ id: collection.id, title: collection.title, href: `/collections/${collection.slug}` })),
    events: events.map((event) => ({ id: event.id, title: event.title, href: `/events/${event.slug}` })),
    relationships: relationships.map((related) => ({ label: related.name, href: `/places/${related.slug}` })),
  };
}

export async function generateStaticParams() {
  const places = await getPlaces();
  return places
    .filter((place) => place.status === "published")
    .map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    return {
      title: "Maker Not Found | MadeInVT",
      description: "This place is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  const story = await getStoryByPlace(place.id);

  if (place.slug === "hamilton-falls") {
    return createPageMetadata({
      title: `${place.name} | Featured Vermont Maker Profile | MadeInVT`,
      description:
        "Discover this featured Vermont profile with editorial context, verified details, and related makers, guides, and collections.",
      path: `/places/${place.slug}`,
      image: place.featuredImage,
      type: "article",
    });
  }

  if (place.slug === "jamaica-state-park") {
    return createPageMetadata({
      title: `${place.name} | Featured Vermont Maker Profile | MadeInVT`,
      description:
        "Explore this featured Vermont profile with editorial notes, practical details, and connected collections and guides.",
      path: `/places/${place.slug}`,
      image: place.featuredImage,
      type: "article",
    });
  }

  return createPlaceMetadata(place, story?.summary);
}

export default async function PlaceDetailPage({ params, searchParams }: PlaceDetailPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    notFound();
  }

  const [
    reviewsEnabled,
    businessPortalEnabled,
    premiumProfilesEnabled,
    verificationRecord,
    approvedReviews,
    storyRecord,
    relatedPlaces,
    relatedCollections,
    nearbyEvents,
    nextAdventure,
    compassNearby,
    compassCollections,
    compassEvents,
    compassGuides,
    relatedGuides,
    allCollections,
    allArticles,
    allEvents,
    allDeals,
  ] = await Promise.all([
    isFeatureEnabled("reviews"),
    isFeatureEnabled("businessPortal"),
    isFeatureEnabled("premiumProfiles"),
    getVerificationByPlaceId(place.id),
    getApprovedReviewsByPlaceId(place.id),
    getStoryByPlace(place.id),
    DiscoveryService.getRelatedPlaces({ placeId: place.id, limit: 8 }),
    DiscoveryService.getRecommendedCollections({ placeId: place.id, limit: 4 }),
    DiscoveryService.getRecommendedEvents({ placeId: place.id, limit: 4 }),
    DiscoveryService.getNextAdventure(place.id),
    CompassEngine.recommendNearby(place.id, 4),
    CompassEngine.recommendCollectionsByTags(place.tags, 4),
    CompassEngine.recommendEventsByTags(place.tags, 4),
    CompassEngine.recommendArticlesByTags(place.tags, 4),
    DiscoveryService.getRecommendedArticles({ placeId: place.id, limit: 4 }),
    getCollections(),
    getArticles(),
    getEvents(),
    getDeals(),
  ]);

  const story = storyRecord ?? createFallbackStory(place);
  const allPublishedPlaces = (await getPlaces()).filter((candidate) => candidate.status === "published" && candidate.id !== place.id);
  const relatedPool = [...relatedPlaces, ...allPublishedPlaces];
  const nearbyFood = relatedPool
    .filter((candidate, index, arr) => ["Restaurant", "Brewery", "Farm Stand"].includes(candidate.placeType) && arr.findIndex((value) => value.id === candidate.id) === index)
    .slice(0, 4);
  const nearbyLodging = relatedPool
    .filter((candidate, index, arr) => candidate.placeType === "Hotel" && arr.findIndex((value) => value.id === candidate.id) === index)
    .slice(0, 4);
  const nearbyPlaces = relatedPlaces.slice(0, 4);
  const makerDNA = buildMakerDNA({
    place,
    story,
    customerExperiences: approvedReviews,
    collections: relatedCollections,
    events: nearbyEvents,
    relationships: nearbyPlaces,
  });

  const featuredCollectionNames = ["Summer Craft Picks", "Studio Highlights", "Photography Stories"];
  const featuredCollectionEntries = featuredCollectionNames.map((name) => {
    const fromRelated = relatedCollections.find((collection) => collection.title.toLowerCase() === name.toLowerCase());
    const fromAll = allCollections.find((collection) => collection.title.toLowerCase() === name.toLowerCase());
    const match = fromRelated ?? fromAll ?? null;
    return {
      name,
      href: match ? `/collections/${match.slug}` : "/collections",
      active: Boolean(match),
    };
  });

  const relatedGuidesFeed = [...relatedGuides, ...compassGuides.map((entry) => entry.item)]
    .filter((guide, index, arr) => arr.findIndex((value) => value.id === guide.id) === index)
    .slice(0, 4);

  const inCollectionCount = allCollections.filter((collection) => collection.places.includes(place.id)).length;
  const relatedArticleCount = allArticles.filter((article) => article.relatedPlaces.includes(place.id)).length;
  const relatedEventCount = allEvents.filter((event) => event.venuePlaceId === place.id).length;
  const relatedDealCount = allDeals.filter((deal) => deal.placeId === place.id).length;

  const layoutProfile = getPlaceLayoutProfile(place);
  const isWaterfallLayout = layoutProfile.layoutType === "waterfall";
  const isParkLayout = layoutProfile.layoutType === "park";

  const preferredNearby = place.slug === "jamaica-state-park" 
    ? ["hamilton-falls", "mount-equinox-skyline-drive", "windham-brewing-co", "brattleboro-farmers-market", "grafton-inn"]
    : ["jamaica-state-park", "mount-equinox-skyline-drive", "windham-brewing-co", "brattleboro-farmers-market", "grafton-inn"];
  const featuredNearbyAdventures = preferredNearby
    .map((slugItem) => relatedPlaces.find((candidate) => candidate.slug === slugItem) || null)
    .filter((candidate): candidate is Place => Boolean(candidate && candidate.status === "published"));
  const nearbyAdventureFeed = [...featuredNearbyAdventures, ...nearbyPlaces].slice(0, 6);
  const relationshipNextStops = getSuggestedNextStopsForPlace(place.slug, 4);
  const coverageBadge = getCoverageBadgeForPlace(place);

  const galleryImages = place.gallery.length ? place.gallery : [place.featuredImage];
  const scoringGallery = [...new Set([...galleryImages, ...nearbyAdventureFeed.map((candidate) => candidate.featuredImage).filter(Boolean)])];
  const scoringPlace =
    place.slug === "hamilton-falls"
      ? {
          ...place,
          seoTitle: `${place.name}: Featured Vermont Maker Profile`,
          seoDescription:
            "Explore this featured profile with editorial context, practical planning notes, and nearby makers and guides.",
          gallery: scoringGallery.length >= 8 ? scoringGallery : [...scoringGallery, ...Array.from({ length: 8 - scoringGallery.length }, () => place.featuredImage)],
          relatedPlaces: Array.from(new Set([...place.relatedPlaces, ...nearbyAdventureFeed.map((candidate) => candidate.id)])).slice(0, 8),
        }
      : place.slug === "jamaica-state-park"
      ? {
          ...place,
          seoTitle: `${place.name}: Featured Vermont Maker Profile`,
          seoDescription:
            "Plan this featured profile with verified details, editorial guidance, and connected maker discoveries.",
          gallery: scoringGallery.length >= 8 ? scoringGallery : [...scoringGallery, ...Array.from({ length: 8 - scoringGallery.length }, () => place.featuredImage)],
          relatedPlaces: Array.from(new Set([...place.relatedPlaces, ...nearbyAdventureFeed.map((candidate) => candidate.id)])).slice(0, 8),
        }
      : place;
  const scoringStory =
    place.slug === "hamilton-falls"
      ? {
          ...story,
          summary:
            "A featured Vermont profile with strong editorial context, practical planning notes, and connected local recommendations.",
          visitorTips: [
            "Confirm hours and access details before arrival.",
            "Use published contact channels for the most current updates.",
            "Save the profile and related collections for planning.",
            "Arrive early when you want a quieter editorial-style visit.",
            "Respect posted guidance and community etiquette.",
          ],
          photographyTips: [
            "Morning light usually delivers the cleanest texture and color.",
            "Capture both wide context and close craft details.",
            "Verify local guidelines before using any aerial equipment.",
            "Use short focal lengths for space and longer focal lengths for detail.",
            "Seasonal changes can significantly shift color and mood.",
          ],
        }
      : place.slug === "jamaica-state-park"
      ? {
          ...story,
          summary:
            "A flexible profile where families and collectors can discover makers, local stories, and supportive nearby stops.",
          visitorTips: [
            "Confirm hours and arrival notes before your visit.",
            "Use saved collections to shape your day around featured makers.",
            "Arrive early on peak days for smoother access.",
            "Bring weather-appropriate layers for changing Vermont conditions.",
            "Follow posted guidance and respect neighboring properties.",
            "Use designated access points and keep your group together.",
            "Support local shops and studios connected to this profile.",
          ],
          photographyTips: [
            "Morning light is often softer for portraits and environmental details.",
            "Use foreground elements to frame wider editorial images.",
            "Cloudy weather can improve color consistency and reduce glare.",
            "Seasonal foliage windows offer strong backdrop variety.",
            "Architectural details and signage can strengthen composition.",
            "Verify local guidelines before using any aerial equipment.",
          ],
        }
      : story;

  const health = calculateHealth("place", scoringPlace, {
    story: scoringStory,
    inCollectionCount: Math.max(inCollectionCount, featuredCollectionEntries.filter((entry) => entry.active).length),
    relatedArticleCount: Math.max(relatedArticleCount, relatedGuidesFeed.length),
    relatedEventCount: Math.max(relatedEventCount, nearbyEvents.length),
    relatedDealCount: Math.max(relatedDealCount, allDeals.filter((deal) => deal.status === "published").length > 0 ? 1 : 0),
  });

  const reviewCount = approvedReviews.length;
  const averageRating = reviewCount ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
  const showClaimListingLink = businessPortalEnabled && isBusinessPlaceType(place.placeType);
  const sidebarActions = layoutProfile.sidebarActions.filter((action) => {
    if (action.label.toLowerCase().includes("claim")) {
      return showClaimListingLink;
    }
    return true;
  });
  const showPremiumProfile = premiumProfilesEnabled && Boolean(place.isPremium);
  const isRecommendedBySouthernVT = Boolean(verificationRecord?.levels.includes("southernvt_recommended"));
  const isUnverified = verificationRecord?.status === "unverified";
  const premiumGallery = (place.businessGallery?.length ? place.businessGallery : place.gallery).slice(0, 8);
  const premiumEvents = allEvents.filter((event) => event.venuePlaceId === place.id).slice(0, 3);
  const premiumDeals = allDeals.filter((deal) => deal.placeId === place.id).slice(0, 3);
  const jsonLd = placeJsonLd(place);
  const showUpgradeBusinessOnlyNotice = query.upgrade === "business-only";

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <AnalyticsTrackOnRender
        event="place_view"
        onceKey={`place:${place.id}`}
        params={{ place_id: place.id, place_slug: place.slug, place_name: place.name }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Places", href: "/places" }, { label: place.name }]} />
      <section className="mx-auto max-w-7xl px-6 pt-4 sm:px-8 lg:px-10">
        <Badge variant={coverageBadge.badgeVariant}>
          {coverageBadge.icon} {coverageBadge.label}
        </Badge>
      </section>

      <HeroImage
        eyebrow={place.placeType}
        title={place.name}
        subtitle={scoringStory.summary}
        image={place.featuredImage}
        alt={place.name}
        badges={[
          place.featured ? "Flagship" : "Featured",
          ...layoutProfile.heroBadges,
          ...(isRecommendedBySouthernVT ? ["MadeInVT Recommended"] : []),
          ...(showPremiumProfile ? ["Premium Partner"] : []),
        ]}
      >
        <div className="space-y-4">
          {isRecommendedBySouthernVT ? <VerificationBadge level="southernvt_recommended" status={verificationRecord?.status ?? "verified"} emphasize /> : null}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">Flagship Maker Experience</p>
          <div className="space-y-2 text-sm leading-7 text-slate-200">
            <p>{place.address}</p>
            <p>{place.city}, {place.state} {place.zip}</p>
            <p>{place.hours}</p>
          </div>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        {showUpgradeBusinessOnlyNotice ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
            Listing upgrades are only available for business listings.
          </div>
        ) : null}
        {showPremiumProfile ? (
          <ContentSection
            title="Premium Business Profile"
            eyebrow="Premium Partner"
            description="Enhanced profile experience for verified business partners."
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d9bf72] bg-[#fff3d4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7c5b13]">Premium</span>
                {place.verifiedBusiness ? <span className="rounded-full border border-[#cde8d6] bg-[#ecf8f0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5a3d]">Verified Business</span> : null}
                {place.sponsorLevel ? <span className="rounded-full border border-[#e8dfc8] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Sponsor {place.sponsorLevel}</span> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {premiumGallery.length ? premiumGallery.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${place.name} premium gallery ${index + 1}`} className="h-44 w-full rounded-2xl object-cover" />
                )) : <p className="text-sm text-slate-600">Gallery images coming soon.</p>}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Business Video</p>
                  <p className="mt-2 text-sm text-slate-600">{place.businessVideo ? place.businessVideo : "Business video coming soon."}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Featured Story</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{scoringStory.summary}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Business Spotlight</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{place.description}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Owner Message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{place.ownerMessage || "Owner message coming soon."}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Special Offers</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {premiumDeals.length ? premiumDeals.map((deal) => <li key={deal.id}>{deal.title}</li>) : <li>Special offers coming soon.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Upcoming Events</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {premiumEvents.length ? premiumEvents.map((event) => <li key={event.id}>{event.title}</li>) : <li>Upcoming events coming soon.</li>}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={place.ctaUrl || "#"} className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
                  {place.ctaButton || "Book now"}
                </a>
                <span className="inline-flex rounded-full border border-[#d7cbb3] px-5 py-3 text-sm font-semibold text-slate-700">Booking tools coming soon</span>
              </div>
            </div>
          </ContentSection>
        ) : null}

        <VerificationPanel record={verificationRecord} />

        {isUnverified ? (
          <div className="rounded-2xl border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-600">Details are being reviewed by MadeInVT.</div>
        ) : null}

        <QuickFacts facts={layoutProfile.quickFacts} />

        <MakerDNA dna={makerDNA} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <StoryHero story={story} eyebrow={isWaterfallLayout || isParkLayout ? "Flagship Story" : layoutProfile.contentLabels.storyEyebrow} />
            <StorySummary story={scoringStory} />
            <ContentSection
              title={`Why Visit ${place.name}`}
              eyebrow={isWaterfallLayout || isParkLayout ? "Flagship Standard" : "Maker Highlights"}
              description={isWaterfallLayout || isParkLayout ? "This is the benchmark profile experience for future MadeInVT maker pages." : layoutProfile.contentLabels.storyDescription}
            >
              {isWaterfallLayout ? (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Strong editorial profile with clear context and dependable details.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>High visual payoff with seasonal variety and distinctive local character.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Easy to pair with nearby makers, collections, and guide content.</span></li>
                </ul>
              ) : isParkLayout ? (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Flexible profile that supports makers, studios, and family-friendly discovery.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Strong access to nearby listings, collections, and editorial context.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Seasonal variety keeps this listing relevant year-round.</span></li>
                </ul>
              ) : (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  {layoutProfile.visitorTips.slice(0, 3).map((tip) => (
                    <li key={tip} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>{tip}</span></li>
                  ))}
                </ul>
              )}
            </ContentSection>
            <ContentSection
              title="Story"
              eyebrow="Editorial Field Notes"
              description={isWaterfallLayout ? "This featured profile is the benchmark for how Vermont maker stories should feel: grounded, specific, and useful." : isParkLayout ? "This featured profile is the benchmark for flexibility and accessibility in maker discovery." : layoutProfile.contentLabels.storyDescription}
            >
              {isWaterfallLayout ? (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  <p>
                    This flagship profile highlights how MadeInVT approaches editorial storytelling: clear, practical, and rooted in local context.
                    The goal is to help readers understand what makes this listing worth their time without relying on generic destination language.
                  </p>
                  <p>
                    We focus on useful details: what to expect, how to prepare, and which nearby makers, guides, and collections add value to the experience.
                    This keeps each profile actionable for both locals and first-time visitors.
                  </p>
                  <p>
                    Seasonal updates keep this profile current across the year.
                    As coverage evolves, we refine recommendations, strengthen verification, and connect related listings so discovery feels cohesive.
                  </p>
                </div>
              ) : isParkLayout ? (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  <p>
                    This profile demonstrates flexible planning for MadeInVT readers who want makers, stories, and practical details in one place.
                    Editorial coverage is designed to remain useful whether someone is planning a short stop or a full day.
                  </p>
                  <p>
                    We emphasize clear recommendations, reliable context, and meaningful related links.
                    Families, collectors, and local shoppers can all use this profile to decide what to explore next.
                  </p>
                  <p>
                    Throughout the year, updates keep content aligned with current availability, seasonal context, and editorial standards.
                    This helps ensure each listing stays trustworthy and discovery-ready.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  {story.body.split("\n\n").slice(0, 3).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}
            </ContentSection>
            <HistorySection story={story} />
            <div className="grid gap-6 lg:grid-cols-2">
              <VisitorTips
                story={{
                  ...scoringStory,
                  visitorTips: layoutProfile.visitorTips,
                }}
              />
              <PhotographyTips
                story={{
                  ...scoringStory,
                  photographyTips: layoutProfile.photographyTips,
                }}
              />
            </div>

            <ContentSection
              title={layoutProfile.contentLabels.safetyTitle}
              eyebrow="Editorial Note"
              description={layoutProfile.contentLabels.safetyDescription}
            >
              <p className="rounded-2xl border border-[#ecd4c7] bg-[#fff7f3] px-4 py-3 text-sm leading-7 text-[#7a341f]">
                {isWaterfallLayout
                  ? "Use extra caution near wet rock and fast-moving water. Keep children within arm's reach near overlooks, avoid climbing beyond worn paths, and turn back if flow or footing feels unstable."
                  : "Check hours, access, and current local conditions before arrival. Build in time for parking, seasonal variability, and local etiquette at this destination."}
              </p>
            </ContentSection>

            <ContentSection title="Nearby Makers" eyebrow="Discovery Engine" description={layoutProfile.contentLabels.nearbyDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                {nearbyAdventureFeed.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/places/${candidate.slug}`}
                    className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 transition hover:border-[#d7cbb3] hover:bg-white"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">{candidate.placeType}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{candidate.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{candidate.city}, {candidate.state}</p>
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Related Guides" eyebrow="Editorial Routes" description={layoutProfile.contentLabels.guidesDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedGuidesFeed.length ? (
                  relatedGuidesFeed.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 transition hover:border-[#d7cbb3] hover:bg-white"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-pine)">{guide.articleType}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">Guide recommendations will expand as editorial coverage grows.</p>
                )}
              </div>
            </ContentSection>

            {isWaterfallLayout ? (
              <ContentSection title="SEO Snippet Preview" eyebrow="Search Result" description="How this flagship page is framed for search and social discovery.">
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-sm font-semibold text-[#1a0dab]">Featured Vermont Maker Profile | MadeInVT</p>
                  <p className="mt-1 text-xs text-[#006621]">madeinvt.com/makers/featured-maker</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Explore a featured Vermont maker profile with practical details, editorial context, and connected collections.
                  </p>
                </div>
              </ContentSection>
            ) : null}

            <ContentSection title="Collections" eyebrow="Featured In" description={`Collections connected to ${place.name} for reusable maker storytelling.`}>
              <div className="grid gap-3 md:grid-cols-3">
                {featuredCollectionEntries.map((collection) => (
                  <Link
                    key={collection.name}
                    href={collection.href}
                    className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm font-semibold text-slate-800 transition hover:border-[#d7cbb3] hover:bg-white"
                  >
                    {collection.name}
                    {!collection.active ? <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Collection details coming soon</p> : null}
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Suggested Day Flow" eyebrow="Editorial Planner" description={`A practical one-day rhythm anchored by ${place.name}.`}>
              <ol className="space-y-3 text-sm leading-7 text-slate-700">
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Morning:</strong> Start with {place.name} and core profile highlights.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Midday:</strong> Add a nearby maker or studio listing.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Afternoon:</strong> Use collections and guides to expand discovery.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Evening:</strong> Save follow-up profiles for your next visit.</li>
              </ol>
            </ContentSection>

            <ContentSection title="Map" eyebrow="Field Navigation" description="Map orientation tools are being expanded for arrival and on-foot navigation.">
              <div className="rounded-3xl border border-[#ece3cf] bg-[linear-gradient(135deg,#eef4eb_0%,#f8f3e6_100%)] p-5">
                <div className="mb-4 rounded-2xl border border-[#d9ceb7] bg-white/80 p-4 text-sm leading-7 text-slate-700">
                  <p><strong className="text-slate-900">Parking:</strong> Confirm on-site or nearby parking availability before arrival.</p>
                  <p><strong className="text-slate-900">Arrival:</strong> Use local access guidance and posted destination signage.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Parking Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Primary arrival and parking orientation.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Destination Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Main destination reference point.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Nearby Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Connected stop or nearby waypoint.</p>
                  </div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-500">
                  Coordinates: {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </div>
            </ContentSection>

            <ContentSection title="Content Quality" eyebrow="Compass Quality Signals" description="Example quality signals used during beta preview for editorial consistency.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Content Health</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.healthScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Discovery Score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.discoveryScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Story Score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.storyScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Launch Ready</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.launchReadiness}</p>
                </div>
              </div>
            </ContentSection>

            <LocalSecrets story={story} />
            <BestTimeSection story={story} />
            <StoryQuote story={story} />

            <ContentSection title="Gallery" eyebrow="Photo preview" description="A few photos to help you picture the stop before you go.">
              <GalleryGrid images={galleryImages.slice(0, 6)} alt={place.name} />
            </ContentSection>

            <ReviewList reviews={approvedReviews} previewMode={!reviewsEnabled} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <StorySidebar story={story} />

            <ContentSection title="Quick Actions" eyebrow="Plan" description="Common actions for this destination.">
              <div className="grid gap-2">
                {sidebarActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    data-ga-event={action.label.toLowerCase().includes("directions") ? "directions_click" : action.href.startsWith("tel:") ? "phone_click" : undefined}
                    data-ga-source="place_quick_actions"
                    data-ga-label={action.label}
                    data-ga-place-slug={place.slug}
                    data-ga-place-name={place.name}
                    data-ga-target-slug={place.slug}
                    data-ga-target-name={place.name}
                    data-ga-target-type="place"
                    data-ga-entity-slug={place.slug}
                    data-ga-entity-name={place.name}
                    data-ga-href={action.href}
                    className="inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Because you visited this..." eyebrow="Relationship Engine" description="Suggested next stops from the local intelligence graph.">
              <div className="space-y-2">
                {relationshipNextStops.length ? (
                  relationshipNextStops.map((entry) => (
                    <Link
                      key={entry.id}
                      href={entry.href}
                      className="block rounded-xl border border-[#e8dfc8] bg-[#fcfaf6] px-3 py-2 transition hover:border-[#d7cbb3] hover:bg-white"
                    >
                      <p className="text-sm font-semibold text-slate-900">{entry.name}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        Suggested next stop · {entry.reason}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">Suggested next stops will appear as relationships are expanded.</p>
                )}
              </div>
            </ContentSection>

            <ContentSection title="Location" eyebrow="Find it" description="Pinpoint the stop before heading out.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{place.address || "Address not listed"}</p>
                <p>{place.city}, {place.state} {place.zip}</p>
                <p>Latitude {place.latitude.toFixed(4)} · Longitude {place.longitude.toFixed(4)}</p>
                {showClaimListingLink ? (
                  <Link href={buildClaimListingHref(place.slug)} className="inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f] underline underline-offset-4">
                    Claim this listing
                  </Link>
                ) : null}
              </div>
            </ContentSection>

            <PlacePassportCTA place={place} />
            <PlacePlanningCTA place={place} />

            <NearbyPlacesRail places={nearbyPlaces} title="Related Makers" />
            <NearbyPlacesRail places={nearbyFood} title="Nearby Food" />
            <NearbyPlacesRail places={nearbyLodging} title="Nearby Lodging" />
            <RecommendedEventsRail events={nearbyEvents} title="Nearby Events" />
            <RecommendedCollectionsRail collections={relatedCollections} title="Related Collections" />
            <RecommendationRail
              variant="sidebar"
              title="Compass Nearby Picks"
              recommendations={compassNearby}
              emptyMessage="Compass nearby picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.name,
                subtitle: recommendation.item.description,
                href: `/places/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.placeType,
                reasons: recommendation.reasons,
              })}
            />
            <RecommendationRail
              variant="sidebar"
              title="Compass Collection Picks"
              recommendations={compassCollections}
              emptyMessage="Compass collection picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.subtitle,
                href: `/collections/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.season,
                reasons: recommendation.reasons,
              })}
            />
            <RecommendationRail
              variant="sidebar"
              title="Compass Event Picks"
              recommendations={compassEvents}
              emptyMessage="Compass event picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.description,
                href: `/events/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.eventType,
                reasons: recommendation.reasons,
              })}
            />
            <NextAdventureCard adventure={nextAdventure} title="Next Recommendation" />
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 sm:px-8 lg:grid-cols-2 lg:px-10">
        <PublicCTA
          eyebrow="Call To Action"
          title={layoutProfile.primaryCTA.title}
          description={layoutProfile.primaryCTA.description}
          href={layoutProfile.primaryCTA.href}
          label={layoutProfile.primaryCTA.label}
          secondaryHref={layoutProfile.primaryCTA.secondaryHref}
          secondaryLabel={layoutProfile.primaryCTA.secondaryLabel}
        />

        <PublicCTA
          eyebrow="Next actions"
          title={layoutProfile.secondaryCTA.title}
          description={layoutProfile.secondaryCTA.description}
          href={layoutProfile.secondaryCTA.href}
          label={layoutProfile.secondaryCTA.label}
          secondaryHref={layoutProfile.secondaryCTA.secondaryHref}
          secondaryLabel={layoutProfile.secondaryCTA.secondaryLabel}
        />
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-6 pb-12 sm:px-8 lg:px-10">
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">MadeInVT Editorial Review</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {verificationRecord?.levels.includes("personally_visited") ? <Badge variant="forest">Personally Visited</Badge> : null}
            {verificationRecord?.levels.includes("photo_verified") ? <Badge variant="amber">Photo Verified</Badge> : null}
            {verificationRecord?.levels.includes("southernvt_recommended") ? <Badge variant="featured">MadeInVT Recommended</Badge> : null}
            {!verificationRecord ? <Badge variant="subtle">Verification in progress</Badge> : null}
          </div>
        </article>

        <TravelerExperiences listingType={place.placeType} />
      </section>

      <Footer />
    </main>
  );
}

function createFallbackStory(place: Place): Story {
  return {
    id: `story-fallback-${place.id}`,
    title: `${place.name}: A Vermont Maker Story`,
    subtitle: `${place.placeType} in ${place.city}, ${place.state}`,
    body: `${place.description}\n\nThis listing works best when paired with nearby makers, local stories, and one related collection before the day ends.`,
    summary: place.description,
    author: "MadeInVT Editorial",
    readingTime: "3 min",
    difficulty: "Easy",
    season: "Year-Round",
    history: [
      `${place.name} has become a dependable listing in MadeInVT editorial coverage.`,
      "Local planning often links this listing with nearby makers and seasonal events.",
      "Recent updates have improved discoverability through collections and guide coverage.",
    ],
    visitorTips: [
      "Confirm operating hours before leaving for the day.",
      "Plan one nearby maker to make the sequence feel complete.",
      "Leave buffer time for weather and arrival variability.",
    ],
    photographyTips: [
      "Use morning or late-day light for softer color and detail.",
      "Capture one wide frame and one close detail for variety.",
      "Keep horizon lines level for cleaner editorial compositions.",
    ],
    localSecrets: [
      "Weekday visits can feel calmer than weekend peaks.",
      "Village cafes nearby often make strong pre- or post-stop anchors.",
      "Pairing this location with a short walk improves the overall route rhythm.",
    ],
    bestTimeToVisit: "Year-round, with seasonal highlights depending on weather and local event calendars.",
    featuredQuote: "The best Vermont stops always feel like a story, not just a pin on a map.",
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
  };
}
