type MakerStoryProps = {
  story: string;
};

export function MakerStory({ story }: MakerStoryProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Story</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">Maker Story</h3>
      <p className="mt-3 text-sm leading-8 text-slate-700">{story || "Story profile coming soon."}</p>
    </article>
  );
}
