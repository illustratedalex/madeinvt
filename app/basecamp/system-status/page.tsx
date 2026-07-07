import { Sidebar } from "@/components/admin";
import { getSystemStatus } from "@/lib/system/systemStatus";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Claims", href: "/basecamp/claims" },
  { label: "Settings", href: "/basecamp/settings" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "System Status", href: "/basecamp/system-status", active: true },
];

function statusPill(status: "Configured" | "Missing") {
  return status === "Configured"
    ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
    : "inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900";
}

export default function BasecampSystemStatusPage() {
  const status = getSystemStatus();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Compass Basecamp</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">System Status</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
              Internal production-readiness status for authentication, email, AI, analytics, and repository mode.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Supabase Auth", value: status.supabaseAuth },
              { label: "Supabase Service Role", value: status.supabaseServiceRole },
              { label: "Resend", value: status.resend },
              { label: "OpenAI", value: status.openai },
              { label: "Analytics", value: status.analytics },
            ].map((item) => (
              <article key={item.label} className="rounded-2xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <div className="mt-3">
                  <span className={statusPill(item.value)}>{item.value}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Repository Mode</p>
                <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">{status.repositoryMode}</p>
              </article>
              <article className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">App URL</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{status.appUrl}</p>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
