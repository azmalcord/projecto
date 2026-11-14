import Image from "next/image";
import { SOCIAL_LINKS, SOCIAL_LABELS } from "@/lib/constants";

export function CreatorSection() {
  return (
    <section id="creator" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-bg.card">
          <div className="grid lg:grid-cols-2">
            <div className="relative p-10 sm:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                Creator
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                The mind behind the lab
              </h2>
              <p className="mt-4 text-text-secondary">
                AORTIC EDU is the educational initiative of HAIDER SCIENCE LAB — a
                science lab dedicated to making physics, chemistry, biology, and the
                broader natural sciences accessible to curious minds around the world.
              </p>
              <p className="mt-4 text-text-secondary">
                The creator leads the lab's educational mission, shaping structured
                playlists, clear explanations, and research-based content that help
                learners move from first principles to genuine understanding.
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
                {Object.entries(SOCIAL_LINKS).filter(([k]) => k !== "email").map(([key, href]) => (
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
            </div>

            <div className="relative flex items-center justify-center bg-gradient-to-br from-brand-900/20 via-bg.elevated to-bg.deep p-10 sm:p-12">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-brand-600/10 blur-2xl opacity-50" />
                <div className="relative grid h-40 w-40 place-items-center rounded-full bg-bg.deep ring-1 ring-white/10">
                  <Image
                    src="/pfp.png"
                    alt="HAIDER SCIENCE LAB creator"
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-full object-cover ring-2 ring-brand-600/50"
                    priority
                  />
                </div>
                <span className="absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm border border-white/10">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
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