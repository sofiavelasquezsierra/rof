import { type Config } from "tailwindcss";
import theme, { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require('daisyui')],
    daisyui: {
      themes: [
        {
          mytheme: {
            primary: "#6f49ceff",
            secondary: "#aeb8feff",
            accent: "#f1f2f6ff",
            neutral: "#f1555dff",
            coral: "f68e93ff",
          },
        }
      ]
  }
} satisfies Config;
