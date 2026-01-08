import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "globals.css",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-bg": "url('/static/images/heroImage.png')",
        "login-bg": "url('/static/images/loginImage2.png')",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#054C73",
          secondary: "#F4F4F4",
          accent: "#FDFDFD",
          neutral: "#AFAFAF",
          "base-100": "#F9F5F6",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
          "base-200": "#D83776",
          "base-300": "#3B5998",
        },
      },
    ],
  },
};
export default config;
