// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Ensure these paths cover all your files
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Covers App Router pages and layouts
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Covers components
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-capitalize-first-letter")],
};
