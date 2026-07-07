"use client";

import { useEffect, useState } from "react";
import type { MakerGalleryImage, MakerGalleryImageStatus } from "@/types/MakerGallery";

type QueueFilter = "pending" | "approved" | "rejected";

function statusClasses(status: MakerGalleryImageStatus) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-900";
}

export function BasecampMakerGalleryReviewClient() {
  const [filter, setFilter] = useState<QueueFilter>("pending");
  const [images, setImages] = useState<MakerGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");

  useEffect(() => {
    async function loadQueue() {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/basecamp/maker-gallery?status=${filter}`);
      const payload = (await response.json()) as { images?: MakerGalleryImage[]; error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Unable to load maker gallery queue.");
        setLoading(false);
        return;
      }
      setImages(payload.images ?? []);
      setLoading(false);
    }

    void loadQueue();
  }, [filter]);

  const reviewImage = async (id: string, status: "approved" | "rejected") => {
    setReviewingId(id);
    const response = await fetch(`/api/basecamp/maker-gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { image?: MakerGalleryImage; error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to review maker gallery image.");
      setReviewingId("");
      return;
    }
    setImages((current) => current.map((entry) => (entry.id === id ? (payload.image ?? entry) : entry)));
    setReviewingId("");
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as QueueFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] ${
              filter === value ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]" : "border-[#d7cbb3] bg-white text-slate-700"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading gallery queue...</p>
      ) : images.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image) => (
            <article key={image.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">{image.makerSlug}</p>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses(image.status)}`}>
                  {image.status}
                </span>
              </div>
              {image.signedUrl ? (
                <img src={image.signedUrl} alt={image.altText || image.caption || `${image.makerSlug} gallery image`} className="mt-3 h-44 w-full rounded-2xl object-cover" />
              ) : null}
              <p className="mt-3 text-sm text-slate-700">{image.caption || "No caption provided."}</p>
              <p className="mt-1 text-xs text-slate-500">Alt text: {image.altText || "Not provided"}</p>
              <p className="mt-2 text-xs text-slate-500">Uploaded: {new Date(image.uploadedAt).toLocaleString()}</p>
              {filter === "pending" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void reviewImage(image.id, "approved")}
                    disabled={reviewingId === image.id}
                    className="rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f8f2e4] disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => void reviewImage(image.id, "rejected")}
                    disabled={reviewingId === image.id}
                    className="rounded-full border border-rose-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-600">No gallery images found for this filter.</p>
      )}
    </section>
  );
}
