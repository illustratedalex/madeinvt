import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";
import type { MediaAsset, MediaAssetStatus, MediaRelationship } from "@/types/MediaAsset";
import type { MediaAssetFilters, MediaAssetInput, MediaRelationshipInput } from "./mediaRepository.mock";

type MediaAssetRow = {
  id: string;
  title: string;
  alt_text: string;
  asset_type: MediaAsset["type"];
  url: string;
  thumbnail_url: string;
  tags: string[] | null;
  attached_to: string[] | null;
  credit: string | null;
  license: string | null;
  notes: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  usage_count: number | null;
  status: MediaAssetStatus | null;
  created_at: string;
  publication: MediaAsset["publication"] | null;
  folder: MediaAsset["folder"] | null;
  section: MediaAsset["section"] | null;
  caption: string | null;
  photographer: string | null;
  captured_at: string | null;
  gps: string | null;
  related_entity_type: MediaAsset["relatedEntityType"] | null;
  related_entity: string | null;
  issue: string | null;
  keywords: string[] | null;
  ai_description: string | null;
  file_name: string | null;
  mime_type: string | null;
};

type MediaRelationshipRow = {
  id: string;
  asset_id: string;
  relation_type: MediaRelationship["relationType"];
  target_type: MediaRelationship["targetType"];
  target_value: string;
  publication: MediaRelationship["publication"];
  created_at: string;
};

function requireSupabaseAdmin() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service role environment variables are missing.");
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function mapMediaRowToAsset(row: MediaAssetRow): MediaAsset {
  return {
    id: row.id,
    title: row.title,
    altText: row.alt_text ?? "",
    type: row.asset_type,
    url: row.url,
    thumbnailUrl: row.thumbnail_url || row.url,
    tags: row.tags ?? [],
    attachedTo: row.attached_to ?? [],
    credit: row.credit ?? undefined,
    license: row.license ?? undefined,
    notes: row.notes ?? undefined,
    fileSize: row.file_size ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    usageCount: row.usage_count ?? 0,
    status: row.status ?? "draft",
    createdAt: row.created_at,
    publication: row.publication ?? "Future",
    folder: row.folder ?? "Gallery",
    section: row.section ?? "All Media",
    caption: row.caption ?? "",
    photographer: row.photographer ?? "",
    capturedAt: row.captured_at ?? row.created_at.slice(0, 10),
    gps: row.gps ?? "",
    relatedEntityType: row.related_entity_type ?? "Maker",
    relatedEntity: row.related_entity ?? "",
    issue: row.issue ?? "",
    keywords: row.keywords ?? [],
    aiDescription: row.ai_description ?? "",
    fileName: row.file_name ?? row.title,
    mimeType: row.mime_type ?? "application/octet-stream",
  };
}

export async function getMediaAssets(filters: MediaAssetFilters = {}): Promise<MediaAsset[]> {
  const client = requireSupabaseAdmin() as any;
  let query: any = client.from("media_assets").select("*").order("created_at", { ascending: false });

  if (filters.publication) query = query.eq("publication", filters.publication);
  if (filters.section && filters.section !== "All Media") query = query.eq("section", filters.section);
  if (filters.tag) query = query.contains("tags", [filters.tag]);
  if (filters.issue) query = query.ilike("issue", `%${filters.issue}%`);
  if (filters.photographer) query = query.ilike("photographer", `%${filters.photographer}%`);
  if (filters.date) query = query.eq("captured_at", filters.date);
  if (filters.relatedEntity) query = query.ilike("related_entity", `%${filters.relatedEntity}%`);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error || !data) {
    throw new Error(`Failed to fetch media assets from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return (data as MediaAssetRow[]).map(mapMediaRowToAsset);
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const client = requireSupabaseAdmin() as any;
  const { data, error } = await client.from("media_assets").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch media asset by id from Supabase: ${error.message}`);
  }
  return data ? mapMediaRowToAsset(data as MediaAssetRow) : null;
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const client = requireSupabaseAdmin() as any;
  const now = new Date().toISOString();
  const payload = {
    title: input.title,
    alt_text: input.altText,
    asset_type: input.type,
    url: input.url,
    thumbnail_url: input.thumbnailUrl,
    tags: input.tags,
    attached_to: input.attachedTo,
    credit: input.credit ?? null,
    license: input.license ?? null,
    notes: input.notes ?? null,
    file_size: input.fileSize ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    usage_count: input.usageCount ?? 0,
    status: input.status,
    created_at: now,
    updated_at: now,
    publication: input.publication,
    folder: input.folder,
    section: input.section,
    caption: input.caption,
    photographer: input.photographer,
    captured_at: input.capturedAt,
    gps: input.gps,
    related_entity_type: input.relatedEntityType,
    related_entity: input.relatedEntity,
    issue: input.issue,
    keywords: input.keywords,
    ai_description: input.aiDescription,
    file_name: input.fileName,
    mime_type: input.mimeType,
  };

  const { data, error } = await client.from("media_assets").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create media asset in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapMediaRowToAsset(data as MediaAssetRow);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const client = requireSupabaseAdmin() as any;
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.altText !== undefined) payload.alt_text = updates.altText;
  if (updates.type !== undefined) payload.asset_type = updates.type;
  if (updates.url !== undefined) payload.url = updates.url;
  if (updates.thumbnailUrl !== undefined) payload.thumbnail_url = updates.thumbnailUrl;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.attachedTo !== undefined) payload.attached_to = updates.attachedTo;
  if (updates.credit !== undefined) payload.credit = updates.credit;
  if (updates.license !== undefined) payload.license = updates.license;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.fileSize !== undefined) payload.file_size = updates.fileSize;
  if (updates.width !== undefined) payload.width = updates.width;
  if (updates.height !== undefined) payload.height = updates.height;
  if (updates.usageCount !== undefined) payload.usage_count = updates.usageCount;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.publication !== undefined) payload.publication = updates.publication;
  if (updates.folder !== undefined) payload.folder = updates.folder;
  if (updates.section !== undefined) payload.section = updates.section;
  if (updates.caption !== undefined) payload.caption = updates.caption;
  if (updates.photographer !== undefined) payload.photographer = updates.photographer;
  if (updates.capturedAt !== undefined) payload.captured_at = updates.capturedAt;
  if (updates.gps !== undefined) payload.gps = updates.gps;
  if (updates.relatedEntityType !== undefined) payload.related_entity_type = updates.relatedEntityType;
  if (updates.relatedEntity !== undefined) payload.related_entity = updates.relatedEntity;
  if (updates.issue !== undefined) payload.issue = updates.issue;
  if (updates.keywords !== undefined) payload.keywords = updates.keywords;
  if (updates.aiDescription !== undefined) payload.ai_description = updates.aiDescription;
  if (updates.fileName !== undefined) payload.file_name = updates.fileName;
  if (updates.mimeType !== undefined) payload.mime_type = updates.mimeType;

  const { data, error } = await client.from("media_assets").update(payload).eq("id", id).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update media asset in Supabase: ${error.message}`);
  }
  return data ? mapMediaRowToAsset(data as MediaAssetRow) : null;
}

export async function updateMediaAssetStatus(id: string, status: MediaAssetStatus): Promise<MediaAsset | null> {
  return updateMediaAsset(id, { status });
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  return updateMediaAssetStatus(id, "archived");
}

export async function createMediaRelationship(input: MediaRelationshipInput): Promise<MediaRelationship> {
  const client = requireSupabaseAdmin() as any;
  const payload = {
    asset_id: input.assetId,
    relation_type: input.relationType,
    target_type: input.targetType,
    target_value: input.targetValue,
    publication: input.publication,
  };
  const { data, error } = await client.from("media_relationships").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create media relationship in Supabase: ${error?.message ?? "unknown error"}`);
  }
  const row = data as MediaRelationshipRow;
  return {
    id: row.id,
    assetId: row.asset_id,
    relationType: row.relation_type,
    targetType: row.target_type,
    targetValue: row.target_value,
    publication: row.publication,
    createdAt: row.created_at,
  };
}

export async function getMediaRelationships(assetId?: string): Promise<MediaRelationship[]> {
  const client = requireSupabaseAdmin() as any;
  let query: any = client.from("media_relationships").select("*").order("created_at", { ascending: false });
  if (assetId) {
    query = query.eq("asset_id", assetId);
  }
  const { data, error } = await query;
  if (error || !data) {
    throw new Error(`Failed to fetch media relationships from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return (data as MediaRelationshipRow[]).map((row) => ({
    id: row.id,
    assetId: row.asset_id,
    relationType: row.relation_type,
    targetType: row.target_type,
    targetValue: row.target_value,
    publication: row.publication,
    createdAt: row.created_at,
  }));
}

export async function getMediaLibrarySummary() {
  const assets = await getMediaAssets();
  const approvedAssets = assets.filter((asset) => asset.status === "approved" || asset.status === "active");
  const recentUploads = assets.slice(0, 5);
  const missingHeroImages = assets.filter((asset) => asset.folder === "Hero" && asset.status !== "approved").length;
  const storiesWithoutGalleries = Math.max(
    0,
    12 - assets.filter((asset) => asset.folder === "Gallery" && (asset.status === "approved" || asset.status === "active")).length,
  );

  return {
    recentUploads,
    missingHeroImages,
    storiesWithoutGalleries,
    approvedCount: approvedAssets.length,
  };
}

export const supabaseMediaRepository = {
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
