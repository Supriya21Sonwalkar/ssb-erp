/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {

      colors: {

        primary: "#610e1e",

        accent: "#ffd963",

        surface: "#faf8f6",

        textDark: "#2b2b2b",

      },

    fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
    },

      container: {

        center: true,

        padding: {

          DEFAULT: "1rem",

          sm: "2rem",

          lg: "3rem",

          xl: "4rem",

          "2xl": "5rem",

        },

      },

    },
  },

  plugins: [],
}