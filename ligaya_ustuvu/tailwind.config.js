module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00254C',
        secondary: '#EEB211',
        neutral: '#FEFEFF',
        accent: '#284D79',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        ligaya: {
          "primary": "#00254C",
          "secondary": "#EEB211",
          "accent": "#284D79",
          "neutral": "#FEFEFF",
          "base-100": "#FEFEFF",
        },
      },
    ],
  },
}
