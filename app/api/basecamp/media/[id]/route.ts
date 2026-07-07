import { NextRequest, NextResponse } from "next/server";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { createMediaRelationship, getMediaAssetById, getMediaRelationships, updateMediaAsset, updateMediaAssetStatus } from "@/lib/repositories/mediaRepository";
import type { CompassPublication, MediaAssetStatus, RelatedEntityType } from "@/types/MediaAsset";

const REVIEWABLE_STATUSES = new Set<MediaAssetStatus>(["draft", "approved", "archived"]);

export async function GET(_request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    await requireBasecampReviewerEmail();
    const { id } = (await context.params) as { id: string };
    const asset = await getMediaAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Media asset not found." }, { status: 404 });
    }
    const relationships = await getMediaRelationships(id);
    return NextResponse.json({ asset, relationships });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load media asset.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    await requireBasecampReviewerEmail();
    const { id } = (await context.params) as { id: string };
    const payload = (await request.json()) as {
      status?: MediaAssetStatus;
      relationType?: "Attach to Story" | "Attach to Maker" | "Attach to Place" | "Use as Hero" | "Use in Collection" | "Export";
      targetType?: RelatedEntityType | "Export";
      targetValue?: string;
      publication?: CompassPublication;
      caption?: string;
      altText?: string;
      aiDescription?: string;
      keywords?: string[];
    };

    const asset = await getMediaAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Media asset not found." }, { status: 404 });
    }

    let updatedAsset = asset;

    if (payload.status) {
      if (!REVIEWABLE_STATUSES.has(payload.status)) {
        return NextResponse.json({ error: "Invalid asset status." }, { status: 400 });
      }
      const next = await updateMediaAssetStatus(id, payload.status);
      if (next) {
        updatedAsset = next;
      }
    }

    if (payload.caption !== undefined || payload.altText !== undefined || payload.aiDescription !== undefined || payload.keywords !== undefined) {
      const next = await updateMediaAsset(id, {
        caption: payload.caption ?? updatedAsset.caption,
        altText: payload.altText ?? updatedAsset.altText,
        aiDescription: payload.aiDescription ?? updatedAsset.aiDescription,
        keywords: payload.keywords ?? updatedAsset.keywords,
      });
      if (next) {
        updatedAsset = next;
      }
    }

    if (payload.relationType && payload.targetType && payload.targetValue && payload.publication) {
      await createMediaRelationship({
        assetId: id,
        relationType: payload.relationType,
        targetType: payload.targetType,
        targetValue: payload.targetValue,
        publication: payload.publication,
      });
    }

    const relationships = await getMediaRelationships(id);
    return NextResponse.json({ asset: updatedAsset, relationships });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update media asset.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
