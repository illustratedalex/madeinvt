type WorkshopCardProps = {
  ships: boolean;
  workshopVisits: boolean;
  customOrders: boolean;
  apprentices: number | null;
  yearsCrafting: number | null;
};

function AvailabilityBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
        enabled ? "border-[#b98958] bg-[#f7efe1] text-[#1f3b2f]" : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {label}: {enabled ? "Yes" : "No"}
    </span>
  );
}

export function WorkshopCard({ ships, workshopVisits, customOrders, apprentices, yearsCrafting }: WorkshopCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Workshop</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <AvailabilityBadge label="Ships" enabled={ships} />
        <AvailabilityBadge label="Workshop Visits" enabled={workshopVisits} />
        <AvailabilityBadge label="Custom Orders" enabled={customOrders} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Apprentices</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{apprentices ?? "N/A"}</p>
        </div>
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Years Crafting</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{yearsCrafting ?? "N/A"}</p>
        </div>
      </div>
    </article>
  );
}
