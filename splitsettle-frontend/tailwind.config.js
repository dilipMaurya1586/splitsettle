/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F2A28',
          50: '#E9F0EF',
          100: '#CFDEDC',
          400: '#3E6864',
          700: '#163634',
          900: '#0F2A28',
        },
        paper: '#F5F7F5',
        teal: {
          DEFAULT: '#0F6B5C',
          50: '#EAF5F2',
          100: '#CFE8E1',
          200: '#9FD1C4',
          400: '#2C8C79',
          500: '#0F6B5C',
          600: '#0C5648',
          700: '#0A4438',
        },
        amber: {
          DEFAULT: '#E8A33D',
          100: '#FBEACC',
          400: '#EEB65C',
          500: '#E8A33D',
          600: '#C9842A',
        },
        coral: {
          DEFAULT: '#E3595A',
          50: '#FCEBEB',
          100: '#F9D3D3',
          500: '#E3595A',
          600: '#C13F40',
        },
        moss: {
          DEFAULT: '#2FA37A',
          50: '#E7F6EF',
          100: '#C8ECDB',
          500: '#2FA37A',
          600: '#238A65',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 42, 40, 0.04), 0 8px 24px -8px rgba(15, 42, 40, 0.12)',
        pop: '0 12px 32px -12px rgba(15, 42, 40, 0.28)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
