/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "360px",
        md: "420px",
        lg: "680px",
      },
      fontFamily: {
        "montserrat-300": ["montserratLight"],
        "montserrat-400": ["montserratRegular"],
        "montserrat-500": ["montserratMedium"],
        "montserrat-600": ["montserratSemiBold"],
        "montserrat-700": ["montserratBold"],
        "montserrat-800": ["montserratBlack"],
      },
      colors: {
        secondery: "#fff",
        primaryText: "#0474DA",
        zinkText: "#8A8A8A",
        optinalColor: "#000",
        bodyText: "#333333",
        profileTextColor: "#0F172A",
        gmailTextColor: "#3F4555",
        seconderyText: "#57A2E6",
      },
      backgroundColor: {
        btnColor: "#0474DA",
        blackBg: "#fff",
        blueBg: "#0474DA",
      },
      borderColor: {
        primaryBorder: "#0474DA",
        lightBorder: "#E6F4FE",
        cardBorder: "#344ceb",
        seconderBoder: "#0058AA",
      },
      // --- ADDED TEXT SIZES ---
      fontSize: {
        small: "13px",
        textLg: "19px",
        textTwoXl: "23px",
      },
    },
  },
  plugins: [],
};
