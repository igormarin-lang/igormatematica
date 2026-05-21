import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#202733",
        track: "#3b4656",
        raceRed: "#cd191e",
        raceBlue: "#125b7f",
        ifGreen: "#2f9e41",
        flagYellow: "#ffd35a",
        pitGreen: "#25a86f"
      },
      boxShadow: {
        soft: "0 20px 55px rgba(23, 32, 51, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
