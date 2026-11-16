import Link from "next/link";
import { Snowfall } from "./snowfall";
import { ScienceBackground } from "./science-background";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <ScienceBackground />
      <Snowfall />
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-bg.deep/70 p-1 ring-1 ring-white/10">
            <img src="/logo.svg" alt="AORTIC EDU logo" className="h-full w-full" width="44" height="44" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-text-main">
              {SITE.name}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              {SITE.brand}
            </span>
          </span>
        </Link>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-text-secondary animate-fade-up">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
          Science education worldwide
        </span>

        <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-text-main sm:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          Explore{" "}
          <span className="text-brand-500">Science.</span>
          <br />
          Understand{" "}
          <span className="text-gradient">Life.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg animate-fade-up" style={{ animationDelay: "200ms" }}>
          {SITE.description}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <a
            href="#science"
            className="btn-hover inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            Explore Science
            <ArrowIcon />
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover inline-flex items-center gap-2 rounded-xl border border-white/10 bg-bg.elevated/40 px-5 py-3 text-sm font-semibold text-text-main backdrop-blur-sm"
          >
            <YouTubeIcon />
            Watch on YouTube
          </a>
        </div>

        <div className="mt-12 flex items-center gap-8 text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
          {[
            { n: "10K+", label: "Learners" },
            { n: "100+", label: "Lessons" },
            { n: "5", label: "Playlists" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-text-main">{s.n}</div>
              <div className="text-xs text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
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