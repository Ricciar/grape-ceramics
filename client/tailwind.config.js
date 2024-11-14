// tailwind.config.js
module.exports = {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Inkluderar alla filtyper där Tailwind kan användas
   ],
   theme: {
      extend: {
         fontFamily: {
            sans: ["Rubik", "sans-serif"],
         },
      },
   },
   plugins: [],
};
