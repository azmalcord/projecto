"use client";

import { useEffect, useState } from "react";

export function ScienceBackground() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Tiny floating particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full science-bg-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Connected molecular nodes */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {MOLECULES.map((m, i) => (
          <g key={i} className="molecule" style={{ animationDelay: `${i * 1.4}s` }}>
            <line
              x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
              stroke="var(--accent-glow)"
              strokeWidth="1"
            />
            <circle cx={m.x1} cy={m.y1} r="2" className="node" fill="var(--accent)" />
            <circle cx={m.x2} cy={m.y2} r="2" className="node" fill="var(--accent-soft)" />
          </g>
        ))}
      </svg>

      {/* Fine orbital lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="orbital-ring" />
        <div className="orbital-ring orbit-slow-rev" style={{ width: "200px", height: "200px" }} />
        <div className="orbital-ring orbit-slow-slow" style={{ width: "280px", height: "280px" }} />
      </div>

      {/* Slowly moving DNA strand */}
      <div className="absolute left-1/2 top-1/2 h-[480px] w-[90px] -translate-x-1/2 -translate-y-1/2 dna-strand">
        <svg viewBox="0 0 90 480" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--accent-soft)" strokeWidth="1.2" fill="none">
            <path d="M45 0 Q66 24 45 48 Q24 72 45 96 Q66 120 45 144 Q24 168 45 192 Q66 216 45 240 Q24 264 45 288 Q66 312 45 336 Q24 360 45 384 Q66 408 45 432 Q24 456 45 480" />
            <path d="M45 0 Q24 24 45 48 Q66 72 45 96 Q24 120 45 144 Q66 168 45 192 Q24 216 45 240 Q66 264 45 288 Q24 312 45 336 Q66 360 45 384 Q24 408 45 432 Q66 456 45 480" />
          </g>
          <g fill="var(--accent-glow)">
            {Array.from({ length: 16 }).map((_, i) => {
              const y = 15 + i * 30;
              const x = 45 + (i % 2 === 0 ? 12 : -12);
              return <circle key={i} cx={x} cy={y} r="2" />;
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  size: [1, 1.4, 1.8, 1.2][i % 4],
  dur: [16, 20, 24, 28][i % 4],
  delay: (i * 1.9) % 14,
}));

const MOLECULES = [
  { x1: 8, y1: 16, x2: 20, y2: 10 },
  { x1: 90, y1: 12, x2: 80, y2: 22 },
  { x1: 12, y1: 80, x2: 24, y2: 72 },
  { x1: 92, y1: 76, x2: 82, y2: 86 },
  { x1: 50, y1: 5, x2: 56, y2: 14 },
  { x1: 50, y1: 95, x2: 44, y2: 86 },
  { x1: 5, y1: 46, x2: 14, y2: 52 },
  { x1: 95, y1: 50, x2: 86, y2: 44 },
  { x1: 28, y1: 36, x2: 38, y2: 28 },
  { x1: 72, y1: 64, x2: 62, y2: 72 },
];