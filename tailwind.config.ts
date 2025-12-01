/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        goalcolor: {
          1: "hsla(288, 71%, 53%, 1)",
          2: "hsla(313, 82%, 64%, 1)",
          3: "hsla(22, 77%, 57%, 1)",
          4: "hsla(51, 100%, 51%, 1)",
          5: "hsla(79, 81%, 64%, 1)",
          6: "hsla(173, 58%, 73%, 1)",
        },
      },
    },
  },
  plugins: [],
};
