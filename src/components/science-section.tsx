import { SCIENCE_CATEGORIES } from "@/lib/constants";

export function ScienceSection() {
  return (
    <section id="science" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Science
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Explore the branches of science
          </h2>
          <p className="mt-3 text-text-secondary">
            From physics and chemistry to biology and astronomy — dive into the disciplines that explain how the universe works.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCIENCE_CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              className="card-hover group relative overflow-hidden rounded-2xl border border-white/5 bg-bg.card p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-600/8 blur-2xl transition group-hover:bg-brand-500/15" />
              <div className="relative">
                <span className="font-mono text-xs text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-semibold text-text-main">{cat.name}</h3>
                <p className="mt-2 text-sm text-text-secondary">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}