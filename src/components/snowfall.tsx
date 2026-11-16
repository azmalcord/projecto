"use client";

import { useEffect, useState } from "react";

export function Snowfall() {
  const [snow, setSnow] = useState<Array<{ left: string; size: string; delay: string; dur: string; opacity: string }>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = 45;
    const newSnow = Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      delay: `${Math.random() * 10}s`,
      dur: `${Math.random() * 8 + 10}s`,
      opacity: `${Math.random() * 0.4 + 0.2}`,
    }));
    setSnow(newSnow);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {snow.map((s, i) => (
        <div
          key={i}
          className="snow-flake"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}