import { NextResponse } from "next/server";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { getMakerGalleryReviewQueue } from "@/lib/makers/gallery";
import type { MakerGalleryImageStatus } from "@/types/MakerGallery";

const ALLOWED_STATUSES = new Set<MakerGalleryImageStatus>(["pending", "approved", "rejected"]);

export async function GET(request: Request) {
  try {
    await requireBasecampReviewerEmail();
    const { searchParams } = new URL(request.url);
    const statusValue = searchParams.get("status");
    const status = statusValue && ALLOWED_STATUSES.has(statusValue as MakerGalleryImageStatus)
      ? (statusValue as MakerGalleryImageStatus)
      : undefined;
    const images = await getMakerGalleryReviewQueue(status);
    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load maker gallery queue.";
    const statusCode = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
