import type { MakerProfileQuality } from "@/types/MakerProfileQuality";

const statusLabel: Record<MakerProfileQuality["status"], string> = {
  needs_research: "Needs Research",
  needs_photos: "Needs Photos",
  needs_story: "Needs Story",
  ready_for_review: "Ready for Review",
  publish_ready: "Publish Ready",
};

const statusTone: Record<MakerProfileQuality["status"], string> = {
  needs_research: "border-amber-200 bg-amber-50 text-amber-900",
  needs_photos: "border-sky-200 bg-sky-50 text-sky-900",
  needs_story: "border-rose-200 bg-rose-50 text-rose-900",
  ready_for_review: "border-indigo-200 bg-indigo-50 text-indigo-900",
  publish_ready: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

interface MakerQualityCardProps {
  quality: MakerProfileQuality;
}

export function MakerQualityCard({ quality }: MakerQualityCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Quality Score: {quality.overallScore}/100</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusTone[quality.status]}`}>
          {statusLabel[quality.status]}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${quality.overallScore}%` }} />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recommended next action</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{quality.recommendedNextAction}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Missing items</p>
      {quality.missingItems.length ? (
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {quality.missingItems.slice(0, 5).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-emerald-700">No critical gaps detected.</p>
      )}
    </article>
  );
}
