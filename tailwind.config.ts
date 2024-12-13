import { type Config } from "tailwindcss";
import theme, { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        title: ['Poppins', 'Arial', 'Helvetica', 'sans-serif'], // Headings
        body: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'],  // Body text
        error: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'], // Error messages
      },
      fontWeight: {
        semibold: 600, // Semi-bold
        normal: 400,   // Normal
        bold: 700,     // Bold
      },
      colors: {
        error: '#FF0000', // Red for error messages
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6f49ceff", //Purple
          secondary: "#aeb8feff", //Pink
          accent: "#f1f2f6ff", //White
          neutral: "#f1555dff", //Red
          info: "f68e93ff", //Coral
        },
      }
    ]
  }
};