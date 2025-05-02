// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Inkluderar alla filtyper där Tailwind kan användas
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      colors: {
        'custom-gray': '#272727', // För knappens ram, text, och hover-bakgrund
      },
      letterSpacing: {
        'custom-wide-xs': '2.28px',
        'custom-wide': '3.04px',
        'custom-wide-2': '4.8px',
      },
    },
  },
  plugins: [],
};
