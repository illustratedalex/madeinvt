import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { createMediaAsset, createMediaRelationship, getMediaAssets, getMediaLibrarySummary } from "@/lib/repositories/mediaRepository";
import { getSupabaseAdminClient, hasSupabaseServiceRoleEnv } from "@/lib/supabase/admin";
import type { CompassPublication, MediaFolder, MediaSection, MediaAssetType, RelatedEntityType } from "@/types/MediaAsset";

const MEDIA_BUCKET = "compass-media";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
]);

const MAX_FILE_BYTES = 100 * 1024 * 1024;

function normalizeTypeFromMime(mimeType: string): MediaAssetType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

function normalizeSection(folder: MediaFolder, type: MediaAssetType): MediaSection {
  if (folder === "Hero") return "Hero Images";
  if (folder === "Drone") return "Drone";
  if (folder === "Portrait") return "Portraits";
  if (folder === "Social") return "Social Images";
  if (folder === "Logos") return "Logos";
  if (folder === "Documents" || type === "document") return "Documents";
  if (type === "video") return "Video";
  return "Photos";
}

async function uploadToSupabaseStorage(input: {
  publication: CompassPublication;
  folder: MediaFolder;
  file: File;
}) {
  if (!hasSupabaseServiceRoleEnv()) {
    return {
      objectPath: `mock/${input.publication}/${input.folder}/${Date.now()}-${input.file.name}`,
      publicUrl: `https://placehold.co/1200x800?text=${encodeURIComponent(input.file.name)}`,
    };
  }

  const extension = input.file.name.includes(".") ? input.file.name.split(".").pop() ?? "bin" : "bin";
  const safeName = `${Date.now()}-${randomUUID()}.${extension}`;
  const objectPath = `${input.publication.toLowerCase().replace(/\s+/g, "-")}/${input.folder.toLowerCase()}/${safeName}`;
  const supabase = getSupabaseAdminClient();
  const uploadResult = await supabase.storage.from(MEDIA_BUCKET).upload(objectPath, input.file, {
    contentType: input.file.type,
    upsert: false,
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return {
    objectPath,
    publicUrl: data.publicUrl,
  };
}

export async function GET(request: NextRequest) {
  try {
    await requireBasecampReviewerEmail();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "summary") {
      const summary = await getMediaLibrarySummary();
      return NextResponse.json(summary);
    }

    const assets = await getMediaAssets({
      search: searchParams.get("search") ?? undefined,
      publication: searchParams.get("publication") ?? undefined,
      section: searchParams.get("section") ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
      issue: searchParams.get("issue") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      photographer: searchParams.get("photographer") ?? undefined,
      relatedEntity: searchParams.get("relatedEntity") ?? undefined,
    });

    return NextResponse.json({ assets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load media assets.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireBasecampReviewerEmail();
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const publication = String(formData.get("publication") ?? "").trim() as CompassPublication;
    const folder = String(formData.get("folder") ?? "").trim() as MediaFolder;
    const caption = String(formData.get("caption") ?? "").trim();
    const altText = String(formData.get("altText") ?? "").trim();
    const photographer = String(formData.get("photographer") ?? "").trim();
    const capturedAt = String(formData.get("capturedAt") ?? "").trim();
    const gps = String(formData.get("gps") ?? "").trim();
    const relatedEntityType = String(formData.get("relatedEntityType") ?? "").trim() as RelatedEntityType;
    const relatedEntity = String(formData.get("relatedEntity") ?? "").trim();
    const issue = String(formData.get("issue") ?? "").trim();
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const keywords = String(formData.get("keywords") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const aiDescription = String(formData.get("aiDescription") ?? "").trim();
    const file = formData.get("file");

    if (!title || !publication || !folder || !relatedEntityType || !relatedEntity || !issue) {
      return NextResponse.json({ error: "Missing required media metadata fields." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File exceeds upload size limit." }, { status: 400 });
    }

    const { objectPath, publicUrl } = await uploadToSupabaseStorage({
      publication,
      folder,
      file,
    });

    const type = normalizeTypeFromMime(file.type);
    const section = normalizeSection(folder, type);

    const asset = await createMediaAsset({
      title,
      altText,
      type,
      url: publicUrl,
      thumbnailUrl: publicUrl,
      tags,
      attachedTo: [`${relatedEntityType.toLowerCase()}:${relatedEntity}`],
      credit: photographer || undefined,
      license: undefined,
      notes: `Storage path: ${objectPath}`,
      fileSize: file.size,
      width: undefined,
      height: undefined,
      usageCount: 0,
      status: "draft",
      publication,
      folder,
      section,
      caption,
      photographer,
      capturedAt: capturedAt || new Date().toISOString().slice(0, 10),
      gps,
      relatedEntityType,
      relatedEntity,
      issue,
      keywords,
      aiDescription,
      fileName: file.name,
      mimeType: file.type,
    });

    await createMediaRelationship({
      assetId: asset.id,
      relationType: "Attach to Story",
      targetType: relatedEntityType,
      targetValue: relatedEntity,
      publication,
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload media asset.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
