/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Crimson Pro", "serif"],
      },
      colors: {
        canvas: "#09090F",
        surface: "#0F1019",
        card: "#161825",
        border: "#1E2040",
        primary: "#E2E8F0",
        secondary: "#8892B0",
        teal: "#14B8A6",
        blue: "#3B82F6",
        amber: "#F59E0B",
      },
      boxShadow: {
        glow: "0 0 60px rgba(20, 184, 166, 0.18)",
      },
    },
  },
  plugins: [],
};
