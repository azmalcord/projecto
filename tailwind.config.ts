import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".orbital-ring": {
          "@apply absolute rounded-full": {},
          "border": "1px solid rgba(239,68,68,0.18)",
          "box-shadow": "0 0 40px -12px rgba(239,68,68,0.25), inset 0 0 30px -18px rgba(239,68,68,0.18)",
        },
        ".dna-strand": {
          "animation": "dna-move 14s ease-in-out infinite",
          "transform-origin": "center center",
        },
        ".molecule": {
          "transform-origin": "center center",
          "animation": "float 9s ease-in-out infinite",
        },
        ".node": {
          "filter": "drop-shadow(0 0 4px rgba(239,68,68,0.5))",
        },
      });
    },
  ],
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF5F5",
          100: "#FFE3E3",
          200: "#FFC2C2",
          300: "#FF9A9A",
          400: "#F5625E",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        bg: {
          deep: "#050505",
          secondary: "#0A0A0A",
          card: "#0E0E0E",
          elevated: "#141414",
          soft: "#111111",
        },
        text: {
          main: "#F5F5F5",
          secondary: "#8A8A8A",
          muted: "#555555",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        editorial: ["Cormorant Garamond", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse at 65% 22%, rgba(239,68,68,0.06), transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(239,68,68,0.04), transparent 60%)",
        "red-gradient":
          "linear-gradient(135deg, #EF4444, #B91C1C)",
      },
      boxShadow: {
        glow: "0 0 30px -8px rgba(239,68,68,0.35)",
        card: "0 18px 50px -22px rgba(0,0,0,0.9)",
        "inset-red": "inset 0 0 0 1px rgba(239,68,68,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "draw": {
          to: { strokeDashoffset: "0" },
        },
        "dna-move": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "particle-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)", opacity: "0.25" },
          "50%": { transform: "translate3d(10px, -16px, 0)", opacity: "0.55" },
        },
        "node-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        "orbit-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "draw": "draw 2.4s ease-out forwards",
        "dna-move": "dna-move 14s ease-in-out infinite",
        "particle-drift": "particle-drift 18s ease-in-out infinite",
        "node-pulse": "node-pulse 7s ease-in-out infinite",
        "orbit-slow": "orbit-slow 40s linear infinite",
        "orbit-slow-rev": "orbit-slow 52s linear infinite reverse",
        "orbit-slow-slow": "orbit-slow 64s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
};

export default config;