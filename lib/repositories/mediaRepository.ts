import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { MediaAssetFilters, MediaAssetInput, MediaRelationshipInput } from "@/lib/repositories/mediaRepository.mock";
import * as mockRepository from "@/lib/repositories/mediaRepository.mock";
import type { MediaAsset, MediaAssetStatus, MediaRelationship } from "@/types/MediaAsset";
type MediaRepositoryModule = {
  getMediaAssets: (filters?: MediaAssetFilters) => Promise<MediaAsset[]>;
  getMediaAssetById: (id: string) => Promise<MediaAsset | null>;
  createMediaAsset: (input: MediaAssetInput) => Promise<MediaAsset>;
  updateMediaAsset: (id: string, updates: Partial<MediaAssetInput>) => Promise<MediaAsset | null>;
  updateMediaAssetStatus: (id: string, status: MediaAssetStatus) => Promise<MediaAsset | null>;
  archiveMediaAsset: (id: string) => Promise<MediaAsset | null>;
  createMediaRelationship: (input: MediaRelationshipInput) => Promise<MediaRelationship>;
  getMediaRelationships: (assetId?: string) => Promise<MediaRelationship[]>;
  getMediaLibrarySummary: () => Promise<{
    recentUploads: MediaAsset[];
    missingHeroImages: number;
    storiesWithoutGalleries: number;
    approvedCount: number;
  }>;
};

async function getActiveMediaRepository(): Promise<MediaRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    const supabaseRepository = (await import("@/lib/repositories/mediaRepository.supabase")) as MediaRepositoryModule;
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getMediaAssets(filters?: MediaAssetFilters): Promise<MediaAsset[]> {
  const repository = await getActiveMediaRepository();
  return repository.getMediaAssets(filters);
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.getMediaAssetById(id);
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const repository = await getActiveMediaRepository();
  return repository.createMediaAsset(input);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.updateMediaAsset(id, updates);
}

export async function updateMediaAssetStatus(id: string, status: MediaAssetStatus): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.updateMediaAssetStatus(id, status);
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.archiveMediaAsset(id);
}

export async function createMediaRelationship(input: MediaRelationshipInput): Promise<MediaRelationship> {
  const repository = await getActiveMediaRepository();
  return repository.createMediaRelationship(input);
}

export async function getMediaRelationships(assetId?: string): Promise<MediaRelationship[]> {
  const repository = await getActiveMediaRepository();
  return repository.getMediaRelationships(assetId);
}

export async function getMediaLibrarySummary() {
  const repository = await getActiveMediaRepository();
  return repository.getMediaLibrarySummary();
}

export const mediaRepository = {
  getAll: getMediaAssets,
  getById: getMediaAssetById,
  create: createMediaAsset,
  update: updateMediaAsset,
  updateStatus: updateMediaAssetStatus,
  archive: archiveMediaAsset,
  createRelationship: createMediaRelationship,
  getRelationships: getMediaRelationships,
  getSummary: getMediaLibrarySummary,
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
