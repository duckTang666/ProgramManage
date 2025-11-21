

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E6F2FF',
        secondary: '#1E88E5',
        accent: '#0D47A1',
        'text-primary': '#2D3748',
        'text-secondary': '#4A5568',
        'text-muted': '#718096',
        'bg-light': '#FFFFFF',
        'bg-gray': '#F7FAFC',
        'border-light': '#E2E8F0'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'sidebar': '2px 0 5px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: [],
}

