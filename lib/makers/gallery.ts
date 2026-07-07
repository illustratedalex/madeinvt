import "server-only";
import { randomUUID } from "crypto";
import { getSupabaseAdminClient, hasSupabaseServiceRoleEnv } from "@/lib/supabase/admin";
import type { MakerGalleryImage, MakerGalleryImageStatus } from "@/types/MakerGallery";

const MAKER_GALLERY_BUCKET = "maker-gallery";
const MAX_MAKER_GALLERY_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type MakerGalleryImageRow = {
  id: string;
  maker_slug: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  status: MakerGalleryImageStatus;
  uploaded_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

type ApprovedClaimListingRow = {
  business_listing_id: string;
};

type ActiveOwnerListingRow = {
  business_listing_id: string;
};

function requireSupabaseAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceRoleKey) {
    throw new Error("Maker galleries require Supabase service role credentials.");
  }
  return { url, serviceRoleKey };
}

function restHeaders(serviceRoleKey: string, extra: Record<string, string> = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;
  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Supabase request failed.";
    throw new Error(errorMessage);
  }
  return payload as T;
}

function mapRow(row: MakerGalleryImageRow): MakerGalleryImage {
  return {
    id: row.id,
    makerSlug: row.maker_slug,
    userId: row.user_id,
    imageUrl: row.image_url,
    caption: row.caption ?? "",
    altText: row.alt_text ?? "",
    status: row.status,
    uploadedAt: row.uploaded_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewedBy: row.reviewed_by ?? undefined,
  };
}

async function withSignedUrls(rows: MakerGalleryImage[]): Promise<MakerGalleryImage[]> {
  const supabase = getSupabaseAdminClient();
  return Promise.all(
    rows.map(async (row) => {
      const { data, error } = await supabase.storage.from(MAKER_GALLERY_BUCKET).createSignedUrl(row.imageUrl, 60 * 60);
      if (error || !data?.signedUrl) {
        return row;
      }
      return { ...row, signedUrl: data.signedUrl };
    }),
  );
}

function getFileExtension(mimeType: string) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }
  if (mimeType === "image/png") {
    return "png";
  }
  return "webp";
}

function validateImageUpload(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP files are allowed.");
  }
  if (file.size <= 0) {
    throw new Error("Image file is empty.");
  }
  if (file.size > MAX_MAKER_GALLERY_BYTES) {
    throw new Error("Image exceeds the 5MB upload limit.");
  }
}

export async function isApprovedMakerOwner(userId: string, makerSlug: string): Promise<boolean> {
  if (!hasSupabaseServiceRoleEnv()) {
    return false;
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const normalizedSlug = makerSlug.trim().toLowerCase();
  if (!normalizedSlug) {
    return false;
  }

  const approvedClaimsQuery = new URLSearchParams({
    select: "business_listing_id",
    business_slug: `eq.${normalizedSlug}`,
    status: "eq.approved",
  });
  const approvedClaimsResponse = await fetch(`${url}/rest/v1/business_claims?${approvedClaimsQuery.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });
  const approvedClaimRows = await parseJsonResponse<ApprovedClaimListingRow[]>(approvedClaimsResponse);
  if (!approvedClaimRows.length) {
    return false;
  }

  const listingIds = [...new Set(approvedClaimRows.map((row) => row.business_listing_id))];
  const encodedListingIds = listingIds.map((id) => `"${id}"`).join(",");

  const ownerQuery = new URLSearchParams({
    select: "business_listing_id",
    user_id: `eq.${userId}`,
    status: "eq.active",
    business_listing_id: `in.(${encodedListingIds})`,
    limit: "1",
  });
  const ownerResponse = await fetch(`${url}/rest/v1/business_listing_owners?${ownerQuery.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });
  const ownerRows = await parseJsonResponse<ActiveOwnerListingRow[]>(ownerResponse);
  return ownerRows.length > 0;
}

export async function createMakerGalleryImage(input: {
  makerSlug: string;
  userId: string;
  caption: string;
  altText: string;
  file: File;
}): Promise<MakerGalleryImage> {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("Maker gallery uploads are not enabled yet.");
  }

  validateImageUpload(input.file);
  const normalizedSlug = input.makerSlug.trim().toLowerCase();
  if (!normalizedSlug) {
    throw new Error("makerSlug is required.");
  }

  const extension = getFileExtension(input.file.type);
  const objectPath = `${normalizedSlug}/${input.userId}/${Date.now()}-${randomUUID()}.${extension}`;

  const supabase = getSupabaseAdminClient();
  const uploadResult = await supabase.storage.from(MAKER_GALLERY_BUCKET).upload(objectPath, input.file, {
    contentType: input.file.type,
    upsert: false,
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const response = await fetch(`${url}/rest/v1/maker_gallery_images`, {
    method: "POST",
    headers: restHeaders(serviceRoleKey, { Prefer: "return=representation" }),
    body: JSON.stringify([
      {
        maker_slug: normalizedSlug,
        user_id: input.userId,
        image_url: objectPath,
        caption: input.caption.trim(),
        alt_text: input.altText.trim(),
        status: "pending",
      },
    ]),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<MakerGalleryImageRow[]>(response);
  const row = rows[0];
  if (!row) {
    throw new Error("Unable to create maker gallery image.");
  }

  const [imageWithSignedUrl] = await withSignedUrls([mapRow(row)]);
  return imageWithSignedUrl ?? mapRow(row);
}

export async function getMakerGalleryImagesForOwner(input: {
  makerSlug: string;
  userId: string;
}): Promise<MakerGalleryImage[]> {
  if (!hasSupabaseServiceRoleEnv()) {
    return [];
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select: "id,maker_slug,user_id,image_url,caption,alt_text,status,uploaded_at,reviewed_at,reviewed_by",
    maker_slug: `eq.${input.makerSlug.trim().toLowerCase()}`,
    user_id: `eq.${input.userId}`,
    order: "uploaded_at.desc",
  });
  const response = await fetch(`${url}/rest/v1/maker_gallery_images?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<MakerGalleryImageRow[]>(response);
  return withSignedUrls(rows.map(mapRow));
}

export async function getApprovedMakerGalleryImages(makerSlug: string): Promise<MakerGalleryImage[]> {
  if (!hasSupabaseServiceRoleEnv()) {
    return [];
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select: "id,maker_slug,user_id,image_url,caption,alt_text,status,uploaded_at,reviewed_at,reviewed_by",
    maker_slug: `eq.${makerSlug.trim().toLowerCase()}`,
    status: "eq.approved",
    order: "uploaded_at.desc",
  });
  const response = await fetch(`${url}/rest/v1/maker_gallery_images?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<MakerGalleryImageRow[]>(response);
  return withSignedUrls(rows.map(mapRow));
}

export async function getMakerGalleryReviewQueue(status?: MakerGalleryImageStatus): Promise<MakerGalleryImage[]> {
  if (!hasSupabaseServiceRoleEnv()) {
    return [];
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select: "id,maker_slug,user_id,image_url,caption,alt_text,status,uploaded_at,reviewed_at,reviewed_by",
    order: "uploaded_at.desc",
  });
  if (status) {
    query.set("status", `eq.${status}`);
  }

  const response = await fetch(`${url}/rest/v1/maker_gallery_images?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });
  const rows = await parseJsonResponse<MakerGalleryImageRow[]>(response);
  return withSignedUrls(rows.map(mapRow));
}

export async function reviewMakerGalleryImage(input: {
  id: string;
  status: Extract<MakerGalleryImageStatus, "approved" | "rejected">;
  reviewedBy: string;
}): Promise<MakerGalleryImage> {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("Maker gallery review is not enabled yet.");
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const encodedId = encodeURIComponent(input.id);
  const response = await fetch(`${url}/rest/v1/maker_gallery_images?id=eq.${encodedId}`, {
    method: "PATCH",
    headers: restHeaders(serviceRoleKey, { Prefer: "return=representation" }),
    body: JSON.stringify({
      status: input.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: input.reviewedBy,
    }),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<MakerGalleryImageRow[]>(response);
  const row = rows[0];
  if (!row) {
    throw new Error("Unable to review maker gallery image.");
  }

  const [imageWithSignedUrl] = await withSignedUrls([mapRow(row)]);
  return imageWithSignedUrl ?? mapRow(row);
}
