type CraftCardProps = {
  craft: string;
  specialties: string[];
  techniques: string[];
};

function Chip({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-[#dcc9a1] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
      {value}
    </span>
  );
}

export function CraftCard({ craft, specialties, techniques }: CraftCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Craft</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">{craft}</h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Specialties</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {specialties.length ? specialties.map((item) => <Chip key={item} value={item} />) : <p className="text-sm text-slate-600">Not specified yet.</p>}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Techniques</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {techniques.length ? techniques.map((item) => <Chip key={item} value={item} />) : <p className="text-sm text-slate-600">Not specified yet.</p>}
          </div>
        </div>
      </div>
    </article>
  );
}
