
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "!**/node_modules/**/*", // Exclude node_modules
    "!**/.next/**/*", // Exclude .next
    "./**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        julius: ['"Julius Sans One"', "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#ff5722", // Orange
        secondary: "#4caf50", // Green

        // Shades
        light: "#E6E4C6", // Light Shade
        white: "#ffffff", // Background (Roshoon)
        grayLight: "#D9D9D9",
        grayLighter: "#F6F6F6",
        grayDark: "#3C4242",
        grayDarker: "#050315",
        grayNeutral: "#807D7E",

        //success
        successBg: "#50704C0D",

        // Greens
        greenPrimary: "#50704C",
        greenSecondary: "#ADCFA9",
        greenDark: "#195908",
        greenOlive: "#54722D",
        greenDeep: "#016C22",
        // Footer
        footerText: "#bbd6b8",
        offer: "#5C9B6E",
        // Profile
        profileBackground: "#F2F4F7",

        // Text Colors
        text: {
          darkGray: "#252C32",
          midGray: "#B0BABF",
          primary: "#000000", // Black
          neutral: "#00000099", // Black with transparency
          footerMention: "#195908", // Dark Green
          greenPrimary: "#50704C",
          greenOlive: "#54722D",
          secondary: "#191D23", // Dark Grey
          ratingColor: "#FCD34D", // Yellow
          secondaryLight: "#64748B", // Light Grey
          chefGray: "#8D8987",
          charcoal: "#252B42",
          deepGray: "#737373",
          muted: "#BDBDBD",
          price: "#23856D",
          alert: "#D5171A",
        },

        danger: {
          50: "#fdecec",
          100: "#fac5c5",
          200: "#f8a9a9",
          300: "#f48282",
          400: "#f26969",
          500: "#ef4444",
          600: "#d93e3e",
          700: "#aa3030",
          800: "#832525",
          900: "#641d1d",
        },

        // Icon Colors
        icon: {
          primary: "#B2D99A",
        },
      },
 
      container: {
        center: true,
        padding: {
          DEFAULT: "0",
        },
      },
      zIndex: {
        min: "100",
        mid: "500",
        max: "999",
      },
    },
  },

} satisfies Config;
