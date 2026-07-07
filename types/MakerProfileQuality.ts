export type MakerProfileQualityStatus =
  | "needs_research"
  | "needs_photos"
  | "needs_story"
  | "ready_for_review"
  | "publish_ready";

export interface MakerProfileQuality {
  makerSlug: string;
  makerName: string;
  overallScore: number;
  storyScore: number;
  photoScore: number;
  productScore: number;
  workshopScore: number;
  contactScore: number;
  trustScore: number;
  missingItems: string[];
  recommendedNextAction: string;
  status: MakerProfileQualityStatus;
}
