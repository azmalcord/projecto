// Temporary generator for the AORTIC EDU identity mark (DNA double helix).
// Writes public/logo.svg, public/favicon.svg, public/og-cover.svg mark regions.
const fs = require("fs");
const path = require("path");

function helix({ cx, top, bottom, amp, periods }) {
  const height = bottom - top;
  const n = 70;
  const left = [];
  const right = [];
  for (let i = 0; i <= n; i++) {
    const y = top + (i / n) * height;
    const theta = (2 * Math.PI * periods * i) / n;
    const lx = cx - amp * Math.cos(theta);
    const rx = cx + amp * Math.cos(theta);
    left.push(lx.toFixed(2) + " " + y.toFixed(2));
    right.push(rx.toFixed(2) + " " + y.toFixed(2));
  }
  const rungs = [];
  const rungCount = periods * 4;
  for (let k = 0; k < rungCount; k++) {
    const theta = Math.PI / 4 + (Math.PI / 2) * k;
    const y = top + (theta / (2 * Math.PI * periods)) * height;
    if (y > top && y < bottom) {
      const lx = cx - amp * Math.cos(theta);
      const rx = cx + amp * Math.cos(theta);
      rungs.push(`${lx.toFixed(2)} ${y.toFixed(2)} ${rx.toFixed(2)} ${y.toFixed(2)}`);
    }
  }
  return { left: left.join(" "), right: right.join(" "), rungs };
}

function mark({ size, cx, cy, r, top, bottom, amp, periods, stroke, bg }) {
  const h = helix({ cx, top, bottom, amp, periods });
  const rungLines = h.rungs
    .map((p) => {
      const [x1, y1, x2, y2] = p.split(" ").map(Number);
      return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#EF4444" stroke-width="${stroke}" stroke-linecap="round" />`;
    })
    .join("\n          ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  ${bg ? `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.25)}" fill="${bg}" />` : ""}
  <circle cx="${cx}" cy="${cy}" r="${r}" stroke="#EF4444" stroke-width="${stroke}" opacity="0.95" />
  <polyline points="${h.left}" stroke="#EF4444" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <polyline points="${h.right}" stroke="#EF4444" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8" />
  ${rungLines}
</svg>`;
}

const logo = mark({
  size: 24, cx: 12, cy: 12, r: 10.5,
  top: 4.5, bottom: 19.5, amp: 3.6, periods: 2,
  stroke: 1.5, bg: null,
});

const favicon = mark({
  size: 32, cx: 16, cy: 16, r: 14,
  top: 6, bottom: 26, amp: 5, periods: 2,
  stroke: 2.2, bg: "#050611",
});

const ogMark = mark({
  size: 300, cx: 150, cy: 150, r: 95,
  top: 60, bottom: 240, amp: 45, periods: 2,
  stroke: 14, bg: null,
});

fs.writeFileSync(path.join(__dirname, "..", "public", "logo.svg"), logo);
fs.writeFileSync(path.join(__dirname, "..", "public", "favicon.svg"), favicon);
fs.writeFileSync(path.join(__dirname, "..", "public", "og-mark.svg"), ogMark);
console.log("wrote logo.svg, favicon.svg, og-mark.svg");