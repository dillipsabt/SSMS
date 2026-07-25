/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          600: '#4f39f6',
          700: '#3d2bc4',
          900: '#1e1b4b',
        },
      },
    },
  },
  plugins: [],
}
