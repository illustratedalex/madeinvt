import { NextResponse } from "next/server";
import { getAuthenticatedOwnerUser } from "@/lib/auth/session";
import {
  createMakerGalleryImage,
  getMakerGalleryImagesForOwner,
  isApprovedMakerOwner,
} from "@/lib/makers/gallery";
import { hasSupabaseServiceRoleEnv } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!hasSupabaseServiceRoleEnv()) {
    return NextResponse.json({ error: "Maker galleries are not enabled yet." }, { status: 503 });
  }

  const user = await getAuthenticatedOwnerUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to view maker gallery uploads." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const makerSlug = searchParams.get("makerSlug")?.trim().toLowerCase() ?? "";
  if (!makerSlug) {
    return NextResponse.json({ error: "makerSlug is required." }, { status: 400 });
  }

  const ownsMaker = await isApprovedMakerOwner(user.id, makerSlug);
  if (!ownsMaker) {
    return NextResponse.json({ error: "You are not approved to upload photos for this maker profile." }, { status: 403 });
  }

  const images = await getMakerGalleryImagesForOwner({ makerSlug, userId: user.id });
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  if (!hasSupabaseServiceRoleEnv()) {
    return NextResponse.json({ error: "Maker galleries are not enabled yet." }, { status: 503 });
  }

  const user = await getAuthenticatedOwnerUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to upload maker gallery photos." }, { status: 401 });
  }

  const formData = await request.formData();
  const makerSlug = String(formData.get("makerSlug") ?? "").trim().toLowerCase();
  const caption = String(formData.get("caption") ?? "");
  const altText = String(formData.get("altText") ?? "");
  const file = formData.get("image");

  if (!makerSlug) {
    return NextResponse.json({ error: "makerSlug is required." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  const ownsMaker = await isApprovedMakerOwner(user.id, makerSlug);
  if (!ownsMaker) {
    return NextResponse.json({ error: "You are not approved to upload photos for this maker profile." }, { status: 403 });
  }

  try {
    const image = await createMakerGalleryImage({
      makerSlug,
      userId: user.id,
      caption,
      altText,
      file,
    });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
