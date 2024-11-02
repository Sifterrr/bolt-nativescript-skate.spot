/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 0.5s ease-in-out infinite alternate',
      },
      colors: {
        brand: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(violet|fuchsia|pink|emerald|teal|amber|orange)-(400|500|600|700)/,
    },
    {
      pattern: /text-(violet|fuchsia|pink|emerald|teal|amber|orange)-(400|500|600|700)/,
    },
    {
      pattern: /from-(violet|fuchsia|pink|emerald|teal|amber|orange)-(400|500|600|700)/,
    },
    {
      pattern: /to-(violet|fuchsia|pink|emerald|teal|amber|orange)-(400|500|600|700)/,
    },
    {
      pattern: /via-(violet|fuchsia|pink|emerald|teal|amber|orange)-(400|500|600|700)/,
    },
  ],
}