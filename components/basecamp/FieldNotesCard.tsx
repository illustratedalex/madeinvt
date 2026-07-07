interface FieldNotesCardProps {
  notes: string;
  interviewNotes: string;
  verificationNotes: string;
  onChangeNotes: (value: string) => void;
  onChangeInterviewNotes: (value: string) => void;
  onChangeVerificationNotes: (value: string) => void;
}

export function FieldNotesCard({
  notes,
  interviewNotes,
  verificationNotes,
  onChangeNotes,
  onChangeInterviewNotes,
  onChangeVerificationNotes,
}: FieldNotesCardProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step 4</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Interview, Audio, Notes, Verification</h2>
      </div>

      <button
        type="button"
        className="min-h-14 w-full rounded-2xl border border-dashed border-[#1f3b2f] bg-[#f2ead6] px-5 text-base font-semibold text-[#1f3b2f]"
      >
        Audio capture placeholder
      </button>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Interview notes</span>
        <textarea
          value={interviewNotes}
          onChange={(event) => onChangeInterviewNotes(event.target.value)}
          placeholder="Record quotes, context, and interview highlights"
          rows={4}
          className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-base text-slate-800 outline-none"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Text notes</span>
        <textarea
          value={notes}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Capture context, caveats, or seasonal observations"
          rows={5}
          className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-base text-slate-800 outline-none"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Verification notes</span>
        <textarea
          value={verificationNotes}
          onChange={(event) => onChangeVerificationNotes(event.target.value)}
          placeholder="Document what was verified onsite and what needs follow-up"
          rows={3}
          className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-base text-slate-800 outline-none"
        />
      </label>
    </section>
  );
}
