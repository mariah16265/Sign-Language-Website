// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 8s ease-in-out infinite',
        'pulse-slower': 'pulse 12s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      fontWeight: {
        extrabold: 800, // Add this if not already present
      },
    },
  },
  plugins: [],
};
