/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.625rem", // 10px (smaller than text-xs)
      },
      fontFamily: {
        "poppins": ["var(--font-poppins)", "sans-serif"],
        "open-sans": ["var(--font-open-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
