import { OVERVIEW_CARDS } from "@/lib/constants";

export function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Overview
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            A learning lab for curious minds
          </h2>
          <p className="mt-3 text-text-secondary">
            Structured lessons, evidence-based research, and curated playlists designed to make science clear.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="card-hover group relative overflow-hidden rounded-2xl border border-white/5 bg-bg.card p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-600/8 blur-2xl transition group-hover:bg-brand-500/15" />
              <div className="relative">
                <span className="font-mono text-xs text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-semibold text-text-main">{card.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}