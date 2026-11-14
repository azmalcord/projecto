"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/constants";
import { useTheme } from "@/components/theme-provider";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme, mounted } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-bg.deep/85 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-bg.deep/70 p-1 ring-1 ring-white/10">
            <img src="/logo.svg" alt="AORTIC EDU logo" className="h-full w-full" width="36" height="36" />
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

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="nav-link rounded-lg px-3 py-2 text-sm font-medium text-text-secondary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <Link
          href="#creator"
          className="group hidden items-center gap-2.5 rounded-full bg-bg.elevated/80 py-1.5 pl-1.5 pr-3 ring-1 ring-white/10 transition hover:ring-brand-600/60 md:flex"
        >
          <span className="relative grid h-8 w-8 place-items-center">
            <span className="absolute inset-0 rounded-full ring-1 ring-brand-600/50 transition group-hover:ring-brand-500/80" />
            <Image
              src="/pfp.png"
              alt="HAIDER SCIENCE LAB creator"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          </span>
          <span className="text-xs font-medium text-text-secondary transition group-hover:text-text-main">
            Creator
          </span>
        </Link>

        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-bg.elevated/60 text-text-secondary transition hover:border-brand-600/60 hover:text-brand-500"
        >
          {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 md:inline-flex"
        >
          <YouTubeIcon />
          YouTube
        </a>

        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-text-main md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-bg.deep/95 backdrop-blur-md md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-text-main"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="#creator"
              className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2"
              onClick={() => setOpen(false)}
            >
              <span className="relative grid h-8 w-8 place-items-center">
                <span className="absolute inset-0 rounded-full ring-1 ring-brand-600/50" />
                <Image
                  src="/pfp.png"
                  alt="HAIDER SCIENCE LAB creator"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </span>
              <span className="text-sm text-text-secondary">Creator</span>
            </Link>
            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/10 bg-bg.elevated/60 px-3 py-2 text-sm text-text-main"
            >
              <span className="inline-flex items-center gap-2">
                {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
              <span className="h-5 w-9 rounded-full bg-white/10 p-0.5">
                <span
                  className={`block h-4 w-4 rounded-full bg-brand-500 transition-transform ${theme === "dark" ? "translate-x-4" : "translate-x-0"}`}
                />
              </span>
            </button>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
            >
              <YouTubeIcon />
              YouTube Channel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Z" />
      <path d="M9.5 15.5V8.5l6 3.5Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}