import Link from "next/link";
import { SITE, SOCIAL_LINKS, SOCIAL_LABELS } from "@/lib/constants";

export function Footer() {
  const year = SITE.year;
  return (
    <footer className="border-t border-white/5 bg-bg.deep">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-bg.deep/70 p-1 ring-1 ring-white/10">
                <img src="/logo.svg" alt="AORTIC EDU logo" className="h-full w-full" width="44" height="44" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-text-main">{SITE.name}</span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  {SITE.brand}
                </span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-text-secondary">
              {SITE.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-main">Explore</h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Overview", href: "#overview" },
                { label: "Science", href: "#science" },
                { label: "Playlists", href: "#playlists" },
                { label: "Latest Videos", href: "#latest" },
                { label: "About", href: "#about" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-text-secondary transition-colors hover:text-brand-400">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-main">Connect</h3>
            <ul className="mt-3 space-y-2">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary transition-colors hover:text-brand-400"
                  >
                    {SOCIAL_LABELS[key as keyof typeof SOCIAL_LABELS]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-main">Lab</h3>
            <p className="mt-3 text-sm text-text-secondary">
              Research-based science education built for curious minds.
            </p>
            <a
              href={SOCIAL_LINKS.email}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-bg.deep/60 px-3 py-2 text-sm text-text-main transition hover:border-brand-600/60 hover:text-brand-400"
            >
              <MailIcon />
              Contact
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-text-muted sm:flex-row">
          <p>© {year} {SITE.name} — {SITE.brand}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made by Azmal
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }} />
          </p>
        </div>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}