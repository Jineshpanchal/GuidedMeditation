/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          light: '#FFD6D6', // Light pink
          medium: '#FFB6C1', // Medium pink
          dark: '#FF8C94', // Dark pink
          accent: '#FFA07A', // Warm accent
          purple: '#DDA0DD', // Soft purple
          blue: '#ADD8E6',  // Light blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-meditation': 'linear-gradient(to right, #FF8C94, #DDA0DD, #ADD8E6)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 