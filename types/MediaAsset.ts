export type MediaAssetType = "image" | "video" | "document";

export type MediaAssetStatus = "draft" | "approved" | "archived" | "active";

export type CompassPublication = "SouthernVT" | "MadeInVT" | "Modern Relic" | "Future";

export type MediaFolder = "Hero" | "Gallery" | "Drone" | "Portrait" | "Workshop" | "Products" | "Social" | "Logos" | "Documents";

export type MediaSection =
  | "All Media"
  | "Photos"
  | "Drone"
  | "Video"
  | "Portraits"
  | "Hero Images"
  | "Social Images"
  | "Logos"
  | "Documents";

export type RelatedEntityType = "Place" | "Maker" | "Business" | "Collection" | "Issue" | "Story";

export interface MediaAsset {
  id: string;
  title: string;
  altText: string;
  type: MediaAssetType;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  attachedTo: string[];
  credit?: string;
  license?: string;
  notes?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  usageCount?: number;
  status: MediaAssetStatus;
  createdAt: string;
  publication: CompassPublication;
  folder: MediaFolder;
  section: MediaSection;
  caption: string;
  photographer: string;
  capturedAt: string;
  gps: string;
  relatedEntityType: RelatedEntityType;
  relatedEntity: string;
  issue: string;
  keywords: string[];
  aiDescription: string;
  fileName: string;
  mimeType: string;
}

export interface MediaRelationship {
  id: string;
  assetId: string;
  relationType: "Attach to Story" | "Attach to Maker" | "Attach to Place" | "Use as Hero" | "Use in Collection" | "Export";
  targetType: RelatedEntityType | "Export";
  targetValue: string;
  publication: CompassPublication;
  createdAt: string;
}
