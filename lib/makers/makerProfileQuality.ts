import type { MakerProfileQuality, MakerProfileQualityStatus } from "@/types/MakerProfileQuality";
import type { Vermont100Maker } from "@/types/Vermont100Maker";

function hasStory(maker: Vermont100Maker) {
  return maker.storyStatus === "Ready" || maker.storyStatus === "Published";
}

function hasCraftCoverage(maker: Vermont100Maker) {
  return Boolean(maker.craft.trim());
}

function hasPhotos(maker: Vermont100Maker) {
  return maker.galleryStatus === "Ready" || maker.galleryStatus === "Published";
}

function hasProductsOrCollections(maker: Vermont100Maker) {
  return maker.collections.length > 0 || maker.giftGuides.length > 0;
}

function hasContact(maker: Vermont100Maker) {
  return Boolean(maker.website.trim() || maker.contactEmail.trim());
}

function hasCustomerExperience(maker: Vermont100Maker) {
  return maker.customerExperienceStatus === "Ready" || maker.customerExperienceStatus === "Published";
}

function hasTrustSignal(maker: Vermont100Maker) {
  return maker.editorialStatus === "Ready" || maker.editorialStatus === "Published" || maker.editorialStatus === "Copy Desk";
}

function hasWorkshopCoverage(maker: Vermont100Maker) {
  return maker.workshop || maker.studioVisits;
}

export function getMakerMissingItems(maker: Vermont100Maker): string[] {
  const missingItems: string[] = [];

  if (!hasStory(maker)) {
    missingItems.push("Story draft");
  }
  if (!hasCraftCoverage(maker)) {
    missingItems.push("Craft/materials/techniques notes");
  }
  if (!hasPhotos(maker)) {
    missingItems.push("Gallery photos");
  }
  if (!hasProductsOrCollections(maker)) {
    missingItems.push("Products or collections coverage");
  }
  if (!hasContact(maker)) {
    missingItems.push("Contact or website");
  }
  if (!hasCustomerExperience(maker)) {
    missingItems.push("Customer experiences");
  }
  if (!hasTrustSignal(maker)) {
    missingItems.push("Editorial trust signal");
  }
  if (!hasWorkshopCoverage(maker)) {
    missingItems.push("Workshop visit notes");
  }

  return missingItems;
}

export function getMakerRecommendedNextAction(maker: Vermont100Maker): string {
  if (!hasStory(maker)) {
    return "Draft or complete the maker story section.";
  }
  if (!hasPhotos(maker)) {
    return "Schedule a photo capture and publish gallery assets.";
  }
  if (!hasProductsOrCollections(maker)) {
    return "Add products/collections references for shopper discovery.";
  }
  if (!hasContact(maker)) {
    return "Confirm website or contact details for profile trust.";
  }
  if (!hasTrustSignal(maker)) {
    return "Advance editorial status to Ready for review.";
  }
  if (!hasCustomerExperience(maker)) {
    return "Collect and publish customer experience notes.";
  }
  if (!hasWorkshopCoverage(maker)) {
    return "Document workshop or studio-visit availability.";
  }
  return "Profile is ready for editorial review and publishing QA.";
}

function getMakerProfileQualityStatus(maker: Vermont100Maker, overallScore: number): MakerProfileQualityStatus {
  if (!hasStory(maker)) {
    return "needs_story";
  }
  if (!hasPhotos(maker)) {
    return "needs_photos";
  }
  if (!hasTrustSignal(maker) || maker.editorialStatus === "Idea" || maker.editorialStatus === "Research") {
    return "needs_research";
  }
  if (overallScore >= 85 && hasProductsOrCollections(maker) && hasContact(maker)) {
    return "publish_ready";
  }
  return "ready_for_review";
}

export function calculateMakerProfileQuality(maker: Vermont100Maker): MakerProfileQuality {
  const storyScore = hasStory(maker) ? 20 : 0;
  const craftScore = hasCraftCoverage(maker) ? 20 : 0;
  const photoScore = hasPhotos(maker) ? 20 : 0;
  const productScore = hasProductsOrCollections(maker) ? 15 : 0;
  const contactScore = hasContact(maker) ? 10 : 0;
  const customerExperienceScore = hasCustomerExperience(maker) ? 5 : 0;
  const trustScore = hasTrustSignal(maker) ? 10 : 0;

  const overallScore = storyScore + craftScore + photoScore + productScore + contactScore + customerExperienceScore + trustScore;
  const missingItems = getMakerMissingItems(maker);
  const recommendedNextAction = getMakerRecommendedNextAction(maker);
  const status = getMakerProfileQualityStatus(maker, overallScore);

  return {
    makerSlug: maker.slug,
    makerName: maker.makerName,
    overallScore,
    storyScore,
    photoScore,
    productScore,
    workshopScore: hasWorkshopCoverage(maker) ? 10 : 0,
    contactScore,
    trustScore,
    missingItems,
    recommendedNextAction,
    status,
  };
}
