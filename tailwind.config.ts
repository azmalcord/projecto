import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".orbital-ring": {
          "@apply absolute rounded-full": {},
          "border": "1px solid rgba(48,72,97,0.18)",
          "box-shadow": "0 0 40px -12px rgba(48,72,97,0.25), inset 0 0 30px -18px rgba(48,72,97,0.18)",
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
          "filter": "drop-shadow(0 0 4px rgba(48,72,97,0.5))",
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
          50: "#F0F4F8",
          100: "#D6E0EA",
          200: "#B3C6D8",
          300: "#8BA6C4",
          400: "#496985",
          500: "#304861",
          600: "#182335",
          700: "#111A27",
          800: "#0C111A",
          900: "#080B10",
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
          "radial-gradient(ellipse at 65% 22%, rgba(48,72,97,0.18), transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(48,72,97,0.12), transparent 60%)",
        "navy-gradient":
          "linear-gradient(135deg, #304861, #182335)",
      },
      boxShadow: {
        glow: "0 0 30px -8px rgba(48,72,97,0.45)",
        card: "0 18px 50px -22px rgba(0,0,0,0.9)",
        "inset-navy": "inset 0 0 0 1px rgba(48,72,97,0.35)",
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