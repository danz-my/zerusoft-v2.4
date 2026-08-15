/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7EC",
        ink: "#101014",
        mint: "#86EFAC",
        cyan: "#7DD3FC",
        pink: "#F9A8D4",
        amber: "#FDE047",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        brut: "6px 6px 0px 0px rgba(16,16,20,1)",
        "brut-sm": "4px 4px 0px 0px rgba(16,16,20,1)",
        "brut-lg": "10px 10px 0px 0px rgba(16,16,20,1)",
      },
    },
  },
  plugins: [],
}

