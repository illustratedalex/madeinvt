import { mediaAssets } from "@/data/media";
import type { MediaAsset, MediaAssetStatus, MediaRelationship } from "@/types/MediaAsset";

export type MediaAssetInput = Omit<MediaAsset, "id" | "createdAt">;

export type MediaAssetFilters = {
  publication?: string;
  section?: string;
  search?: string;
  tag?: string;
  issue?: string;
  photographer?: string;
  date?: string;
  relatedEntity?: string;
};

export type MediaRelationshipInput = Omit<MediaRelationship, "id" | "createdAt">;

let mediaStore: MediaAsset[] = mediaAssets.map((asset) => ({
  ...asset,
  tags: [...asset.tags],
  attachedTo: [...asset.attachedTo],
  keywords: [...asset.keywords],
}));

let mediaRelationshipsStore: MediaRelationship[] = mediaAssets.map((asset) => ({
  id: `media-rel-${asset.id}`,
  assetId: asset.id,
  relationType: "Attach to Maker",
  targetType: asset.relatedEntityType,
  targetValue: asset.relatedEntity,
  publication: asset.publication,
  createdAt: asset.createdAt,
}));

function cloneAsset(asset: MediaAsset): MediaAsset {
  return {
    ...asset,
    tags: [...asset.tags],
    attachedTo: [...asset.attachedTo],
    keywords: [...asset.keywords],
  };
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getMediaAssets(filters: MediaAssetFilters = {}): Promise<MediaAsset[]> {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return mediaStore
    .filter((asset) => (filters.publication ? asset.publication === filters.publication : true))
    .filter((asset) => (filters.section && filters.section !== "All Media" ? asset.section === filters.section : true))
    .filter((asset) => (filters.tag ? asset.tags.includes(filters.tag) : true))
    .filter((asset) => (filters.issue ? asset.issue.toLowerCase().includes(filters.issue.toLowerCase()) : true))
    .filter((asset) => (filters.photographer ? asset.photographer.toLowerCase().includes(filters.photographer.toLowerCase()) : true))
    .filter((asset) => (filters.date ? asset.capturedAt === filters.date : true))
    .filter((asset) => (filters.relatedEntity ? asset.relatedEntity.toLowerCase().includes(filters.relatedEntity.toLowerCase()) : true))
    .filter((asset) => {
      if (!query) {
        return true;
      }
      return `${asset.title} ${asset.caption} ${asset.altText} ${asset.tags.join(" ")} ${asset.relatedEntity} ${asset.issue} ${asset.photographer}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(cloneAsset);
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const asset = mediaStore.find((item) => item.id === id);
  return asset ? cloneAsset(asset) : null;
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const created: MediaAsset = {
    ...input,
    id: createId("media"),
    createdAt: new Date().toISOString(),
  };
  mediaStore = [created, ...mediaStore];
  return cloneAsset(created);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const index = mediaStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const updated: MediaAsset = {
    ...mediaStore[index],
    ...updates,
  };
  mediaStore[index] = updated;
  return cloneAsset(updated);
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  return updateMediaAssetStatus(id, "archived");
}

export async function updateMediaAssetStatus(id: string, status: MediaAssetStatus): Promise<MediaAsset | null> {
  return updateMediaAsset(id, { status });
}

export async function createMediaRelationship(input: MediaRelationshipInput): Promise<MediaRelationship> {
  const created: MediaRelationship = {
    ...input,
    id: createId("media-rel"),
    createdAt: new Date().toISOString(),
  };
  mediaRelationshipsStore = [created, ...mediaRelationshipsStore];
  return { ...created };
}

export async function getMediaRelationships(assetId?: string): Promise<MediaRelationship[]> {
  const rows = assetId ? mediaRelationshipsStore.filter((row) => row.assetId === assetId) : mediaRelationshipsStore;
  return rows.map((row) => ({ ...row }));
}

export async function getMediaLibrarySummary() {
  const approvedAssets = mediaStore.filter((asset) => asset.status === "approved" || asset.status === "active");
  const recentUploads = [...mediaStore]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map(cloneAsset);
  const missingHeroImages = mediaStore.filter((asset) => asset.folder === "Hero" && asset.status !== "approved").length;
  const storiesWithoutGalleries = Math.max(
    0,
    12 - mediaStore.filter((asset) => asset.folder === "Gallery" && (asset.status === "approved" || asset.status === "active")).length,
  );

  return {
    recentUploads,
    missingHeroImages,
    storiesWithoutGalleries,
    approvedCount: approvedAssets.length,
  };
}

export const mockMediaRepository = {
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  updateMediaAssetStatus,
  archiveMediaAsset,
  createMediaRelationship,
  getMediaRelationships,
  getMediaLibrarySummary,
};
