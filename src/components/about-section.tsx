import Image from "next/image";
import { SITE, SOCIAL_LINKS, SOCIAL_LABELS } from "@/lib/constants";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-bg.card">
          <div className="grid lg:grid-cols-2">
            <div className="relative p-10 sm:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                About
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                A lab dedicated to science education
              </h2>
              <p className="mt-4 text-text-secondary">
                {SITE.name} is the educational arm of {SITE.brand} — a science lab
                committed to making physics, chemistry, biology, astronomy and the
                broader natural sciences accessible, evidence-based, and engaging.
              </p>
              <p className="mt-4 text-text-secondary">
                From the atom to the cosmos, our lessons explore the branches of
                science through structured playlists, clear explanations, and
                research-backed facts — one lesson at a time.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { n: "10K+", label: "Subscribers" },
                  { n: "100+", label: "Lessons" },
                  { n: "5", label: "Playlists" },
                  { n: "Daily", label: "New content" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-bg.elevated p-4">
                    <div className="text-xl font-bold text-text-main">{s.n}</div>
                    <div className="text-xs text-text-muted">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-bg.deep/60 px-4 py-2.5 text-sm font-medium text-text-main backdrop-blur-sm transition hover:border-brand-600/60 hover:text-brand-400"
                  >
                    {SOCIAL_LABELS[key as keyof typeof SOCIAL_LABELS]}
                  </a>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/5 bg-bg.deep/60 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Official channel
                </p>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-brand-500 transition hover:text-brand-400"
                >
                  <YouTubeIcon />
                  @aorticedu_haidersciencelabs
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center bg-gradient-to-br from-brand-900/20 via-bg.elevated to-bg.deep p-10 sm:p-12">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-brand-600/10 blur-2xl opacity-50" />
                <div className="relative grid h-40 w-40 place-items-center rounded-full bg-bg.deep ring-1 ring-white/10">
                  <Image
                    src="/pfp.png"
                    alt="HAIDER SCIENCE LAB creator profile"
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-full object-cover ring-2 ring-brand-600/50"
                  />
                </div>
                <span className="absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm border border-white/10">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
                  HAIDER SCIENCE LAB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Z" />
      <path d="M9.5 15.5V8.5l6 3.5Z" fill="#050505" />
    </svg>
  );
}