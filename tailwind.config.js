/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
