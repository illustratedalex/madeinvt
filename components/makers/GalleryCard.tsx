import Image from "next/image";

type GalleryCardProps = {
  gallery: string[];
};

export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Gallery</p>
      {gallery.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {gallery.slice(0, 4).map((image, index) => (
            <div key={`${image}-${index}`} className="relative h-36 overflow-hidden rounded-2xl border border-[#ece3cf] bg-[#fcfaf6]">
              <Image src={image} alt={`Maker gallery ${index + 1}`} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Gallery coming soon.</p>
      )}
    </article>
  );
}
