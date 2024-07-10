/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        junglegreen: "#004B49",
        mintgreen: "#FF6347",
        limegreen: "#32CD32",
        ecogreen: "#4E6C50",
        freshgreen: "#B3E4B8",
        veggiesgreen: "#009055",
      },
    },
  },
  plugins: [],
};
