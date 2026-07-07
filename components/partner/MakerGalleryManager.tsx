"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import type { MakerGalleryImage } from "@/types/MakerGallery";

interface MakerGalleryManagerProps {
  makerSlug: string;
  makerName: string;
}

function statusBadgeClasses(status: MakerGalleryImage["status"]) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-900";
}

export function MakerGalleryManager({ makerSlug, makerName }: MakerGalleryManagerProps) {
  const [images, setImages] = useState<MakerGalleryImage[]>([]);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      const response = await fetch(`/api/partner-portal/maker-gallery?makerSlug=${encodeURIComponent(makerSlug)}`);
      const payload = (await response.json()) as { images?: MakerGalleryImage[]; error?: string };
      if (!response.ok) {
        setMessage(payload.error ?? "Unable to load maker gallery.");
        setLoading(false);
        return;
      }
      setImages(payload.images ?? []);
      setLoading(false);
    }

    void loadImages();
  }, [makerSlug]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage("Choose an image file to upload.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("makerSlug", makerSlug);
    formData.append("caption", caption);
    formData.append("altText", altText);
    formData.append("image", file);

    const response = await fetch("/api/partner-portal/maker-gallery", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as { image?: MakerGalleryImage; error?: string };
    if (!response.ok || !payload.image) {
      setMessage(payload.error ?? "Unable to upload maker gallery image.");
      setSubmitting(false);
      return;
    }

    setImages((current) => [payload.image!, ...current]);
    setCaption("");
    setAltText("");
    setFile(null);
    setMessage("Image uploaded. It will appear publicly after editorial approval.");
    setSubmitting(false);
  };

  return (
    <section className="mt-4 space-y-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Gallery</p>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Upload image for {makerName}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Image (JPG, PNG, WEBP · max 5MB)
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Alt text
            <Input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe the image for accessibility" />
          </label>
        </div>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Caption
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="min-h-20 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
            placeholder="Optional editorial caption"
          />
        </label>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload image"}
        </Button>
      </form>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading gallery submissions...</p>
      ) : images.length ? (
        <div className="space-y-3">
          {images.map((image) => (
            <article key={image.id} className="rounded-2xl border border-[#e8dfc8] bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusBadgeClasses(image.status)}`}>
                  {image.status}
                </span>
                <p className="text-xs text-slate-500">
                  Uploaded {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {image.signedUrl ? (
                <img src={image.signedUrl} alt={image.altText || image.caption || `${makerName} gallery image`} className="mt-3 h-40 w-full rounded-xl object-cover" />
              ) : null}
              <p className="mt-2 text-sm text-slate-700">{image.caption || "No caption provided."}</p>
              <p className="mt-1 text-xs text-slate-500">Alt text: {image.altText || "Not provided"}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">No gallery images uploaded yet.</p>
      )}
    </section>
  );
}
