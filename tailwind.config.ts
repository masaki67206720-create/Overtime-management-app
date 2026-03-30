import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f5ff",
          green: "#39ff14",
          pink: "#ff00ff",
          yellow: "#ffff00",
        },
      },
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff",
        "neon-green": "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14",
        "neon-pink": "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
        "neon-sm-cyan": "0 0 5px #00f5ff, 0 0 10px #00f5ff",
        "neon-sm-green": "0 0 5px #39ff14, 0 0 10px #39ff14",
      },
    },
  },
  plugins: [],
};

export default config;
