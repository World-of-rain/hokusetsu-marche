/** @type {import('tailwindcss').Config} */
// デザイントークン。色は「紙・墨・柿・若葉・芥子」の5系統に絞る（styles/globals.css の CSS 変数と対）
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#f3eee4", deep: "#e9e2d4", light: "#faf7f1" },
        ink: { DEFAULT: "#1c1a16", soft: "#4a463e", mute: "#6b655a", line: "#d8d0bf" },
        // 柿色は白抜き・地の上の小さな文字のどちらでも 4.5:1 以上になる深さにする
        persimmon: { DEFAULT: "#c4361a", deep: "#9e2c14", tint: "#fbe3da" },
        leaf: { DEFAULT: "#2f6b4f", deep: "#1f4a37", tint: "#dcebe2" },
        mustard: { DEFAULT: "#e7b13c", tint: "#f8ebc8" },
        plum: { DEFAULT: "#6b4aa0", tint: "#ebe4f6" },
      },
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "BIZ UDPGothic",
          "Meiryo",
          "sans-serif",
        ],
        display: ["var(--font-display)", "Hiragino Mincho ProN", "Noto Serif JP", "serif"],
        num: ["var(--font-num)", "Georgia", "serif"],
      },
      letterSpacing: { tightest: "-0.04em" },
      maxWidth: { page: "84rem" },
      boxShadow: {
        card: "0 1px 0 rgba(28,26,22,.06), 0 12px 28px -18px rgba(28,26,22,.28)",
        lift: "0 2px 0 rgba(28,26,22,.08), 0 24px 40px -22px rgba(28,26,22,.38)",
      },
      transitionTimingFunction: { out: "cubic-bezier(.16,1,.3,1)" },
    },
  },
  plugins: [],
};
