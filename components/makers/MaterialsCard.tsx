type MaterialsCardProps = {
  materials: string[];
};

export function MaterialsCard({ materials }: MaterialsCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Materials</p>
      {materials.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
          {materials.map((material) => (
            <li key={material} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f3b2f]" />
              <span>{material}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Material profile coming soon.</p>
      )}
    </article>
  );
}
