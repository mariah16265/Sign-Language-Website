module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 8s ease-in-out infinite',
        'pulse-slower': 'pulse 12s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
    }, // ✅ this closing brace was missing
  },
  plugins: [],
};
