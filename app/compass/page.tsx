import Link from "next/link";

const sectionCards = [
  { title: "Publications", value: "2 active", note: "MadeInVT · SouthernVT" },
  { title: "Traffic", value: "124k/mo", note: "Cross-publication estimate" },
  { title: "Deployments", value: "7 this month", note: "Zero rollback target" },
  { title: "Stories", value: "318 published", note: "Editorial network total" },
  { title: "Issues", value: "4 open", note: "Operational + editorial blockers" },
  { title: "Partners", value: "62", note: "Founding + publication partners" },
  { title: "Analytics", value: "Healthy", note: "Data ingest and reporting online" },
  { title: "Roadmap", value: "Q3 in progress", note: "Compass foundation milestones" },
];

const latestCommits = [
  { hash: "947e000", message: "Add MadeInVT maker profile quality scoring", branch: "develop" },
  { hash: "bef3a87", message: "Prepare MadeInVT account signup", branch: "develop" },
  { hash: "c9811be", message: "Wire MadeInVT publication identity config", branch: "develop" },
];

const upcomingIssues = [
  "Compass Core extraction kickoff",
  "Publication config phase 2: navigation and theme tokens",
  "Maker claim-owner linking ops runbook",
  "Compass HQ publication alerts",
];

const publicationHealth = [
  { name: "MadeInVT", health: "Healthy", launch: "Public Beta", statusTone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "SouthernVT", health: "Stable", launch: "Legacy Active", statusTone: "text-sky-700 bg-sky-50 border-sky-200" },
];

export default function CompassPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-[#e8dfc8] bg-white/85 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Compass HQ</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Manage every publication</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
            Central operations dashboard for Compass — monitor publication health, launch readiness, editorial velocity, and platform execution in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/basecamp" className="rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-white">
              Open Basecamp
            </Link>
            <Link href="/basecamp/vermont-100-makers" className="rounded-full border border-[#d7cbb3] bg-white px-5 py-2 text-sm font-semibold text-slate-800">
              Makers Operations
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sectionCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-600">{card.note}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Latest Commits</h2>
            <ul className="mt-4 space-y-3">
              {latestCommits.map((commit) => (
                <li key={commit.hash} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3">
                  <p className="font-semibold text-slate-900">{commit.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {commit.hash} · {commit.branch}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Upcoming Issues</h2>
            <ul className="mt-4 space-y-3">
              {upcomingIssues.map((issue) => (
                <li key={issue} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700">
                  {issue}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Publication Health</h2>
            <div className="mt-4 space-y-3">
              {publicationHealth.map((publication) => (
                <div key={publication.name} className="flex items-center justify-between rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3">
                  <p className="font-semibold text-slate-900">{publication.name}</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${publication.statusTone}`}>
                    {publication.health}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Launch Status</h2>
            <div className="mt-4 space-y-3">
              {publicationHealth.map((publication) => (
                <div key={`${publication.name}-launch`} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3">
                  <p className="font-semibold text-slate-900">{publication.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{publication.launch}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
