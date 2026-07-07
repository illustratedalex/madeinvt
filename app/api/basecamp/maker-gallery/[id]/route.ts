import { NextResponse } from "next/server";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { reviewMakerGalleryImage } from "@/lib/makers/gallery";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const payload = (await request.json()) as { status?: "approved" | "rejected" };
  if (!payload.status || (payload.status !== "approved" && payload.status !== "rejected")) {
    return NextResponse.json({ error: "Status must be approved or rejected." }, { status: 400 });
  }

  try {
    const reviewerEmail = await requireBasecampReviewerEmail();
    const { id } = await params;
    const image = await reviewMakerGalleryImage({
      id,
      status: payload.status,
      reviewedBy: reviewerEmail,
    });
    return NextResponse.json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to review maker gallery image.";
    const statusCode = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
