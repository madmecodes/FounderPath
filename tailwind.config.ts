import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FitQuest-inspired pixel-RPG palette
        ink: "#0b0e14",        // near-black background
        panel: "#11151f",      // card background
        panel2: "#171c28",     // raised card
        line: "#252c3a",       // borders
        gold: "#f5b424",       // primary accent (CTA / XP)
        goldlt: "#ffd35c",
        quest: "#7CFFB2",      // "how it works" green label
        sky: "#5aa9e6",        // info blue
        ember: "#ff6b4a",      // danger / wrong
        heart: "#ff4d6d",      // hearts
        muted: "#8a94a7",      // muted text
        parchment: "#e9e4d6",  // light text
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pixel: "0 4px 0 0 rgba(0,0,0,0.45)",
        "pixel-gold": "0 4px 0 0 #a6790f",
        "pixel-sm": "0 3px 0 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        popin: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-6px)" },
          "40%,80%": { transform: "translateX(6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        clouddrift: {
          "0%": { transform: "translateX(-2%)" },
          "100%": { transform: "translateX(2%)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "0.6" },
        },
        beam: {
          "0%,100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        popin: "popin 0.25s ease-out",
        shake: "shake 0.4s ease-in-out",
        shimmer: "shimmer 2.5s linear infinite",
        clouddrift: "clouddrift 24s ease-in-out infinite alternate",
        twinkle: "twinkle 3.5s ease-in-out infinite",
        beam: "beam 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
