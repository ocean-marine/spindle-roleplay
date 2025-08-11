import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./client/index.html", "./client/**/*.{jsx,tsx,ts,js}"],
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

export default config;