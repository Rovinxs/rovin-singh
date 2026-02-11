/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f172a',
          light: '#64748b',
        },
        accent: '#0a4dbd',
        muted: '#4b5672',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Source Serif 4', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}