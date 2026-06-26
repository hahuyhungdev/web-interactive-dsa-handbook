/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FDFBF7',  // Main warm paper background
          dark: '#F4F1EA',   // Slightly darker tactile paper for cards/accordions
          DEFAULT: '#FDFBF7',
        },
        charcoal: {
          light: '#5A5A5A',  // Soft charcoal for secondary/body prose
          DEFAULT: '#2D2D2D', // Deep charcoal for high-contrast headers/UI
          dark: '#1C1C1C',   // Rich dark charcoal
        },
        coral: {
          light: '#F78475',  // Hover/light coral accents
          DEFAULT: '#E05342', // Vibrant editorial coral brand accent
          dark: '#B83B2C',   // Active/darker state coral
        },
      },
      fontFamily: {
        // Serif typography for headings, blockquotes, and editorial prose
        editorial: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        // Sans-serif typography for interactive controls, buttons, tables, and nav links
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Monospace typography for source code highlights and playback metadata
        mono: ['"JetBrains Mono"', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(45, 45, 45, 0.04)',
        'premium-hover': '0 12px 40px rgba(45, 45, 45, 0.08)',
      }
    },
  },
  plugins: [],
}
