interface PhotoCaptureCardProps {
  previewImages: string[];
  onCapturePhoto: () => void;
  onUploadPhoto: () => void;
}

export function PhotoCaptureCard({ previewImages, onCapturePhoto, onUploadPhoto }: PhotoCaptureCardProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step 2</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Photos + Video</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Capture visual proof quickly with camera-first tools for photo and video.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCapturePhoto}
          className="min-h-14 rounded-2xl bg-[#1f3b2f] px-5 text-base font-semibold text-[#f8f2e4] transition hover:bg-[#2b493a]"
        >
          Camera
        </button>
        <button
          type="button"
          onClick={onUploadPhoto}
          className="min-h-14 rounded-2xl border border-[#1f3b2f] bg-white px-5 text-base font-semibold text-[#1f3b2f] transition hover:bg-[#f2ead6]"
        >
          Upload
        </button>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Video</p>
        <p className="mt-2 text-sm text-slate-700">Video capture/import placeholder. Attach clips during field capture or later review.</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Gallery preview</p>
        {previewImages.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previewImages.map((src) => (
              <img key={src} src={src} alt="Field capture preview" className="h-28 w-full rounded-2xl object-cover" />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-600">No photos captured yet.</p>
        )}
      </div>
    </section>
  );
}
