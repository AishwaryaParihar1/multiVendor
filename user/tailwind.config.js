module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8D6749",
        secondary: "#4E5D45",
        accent: "#CBAF7A",
        background: "#F6F1EC",
        error: "#E76D62",
        success: "#22C55E",
        warning: "#FACC15",
        card: "#FFFFFF",
        sidebar: "#18181B",
        border: "#E5E7EB",
        muted: "#9CA3AF",
        heading: "#1E293B",
        link: "#2563EB",
        overlay: "rgba(0,0,0,0.1)",
      },
      fontFamily: {
        openSans: ['"Tajawal"', "Arial", "Helvetica", "sans-serif"],
        cinzel: ['"Cinzel"', "serif"],
        archivo: ['"Archivo"', "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
