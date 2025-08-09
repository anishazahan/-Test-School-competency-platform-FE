
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
        inter: ["Inter", "sans-serif"],
     
      },
      colors: {
        primary: "#ff5722", // Orange
        secondary: "#4caf50", // Green
        text: {
          darkGray: "#252C32",
          midGray: "#B0BABF",
        },

        danger: {
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
