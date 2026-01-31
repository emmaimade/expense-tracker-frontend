/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ CRITICAL: This enables dark mode based on the 'dark' class
  theme: {
    extend: {},
  },
  plugins: [],
}

// If using CommonJS instead of ES modules, use this format:
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }