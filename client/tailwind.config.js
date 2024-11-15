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
         colors: {
            "custom-gray": "#272727", // För knappens ram, text, och hover-bakgrund
         },
         letterSpacing: {
            "custom-wide": "3.04px", // Skapar en ny klass för letter-spacing
         },
      },
   },
   plugins: [],
};
