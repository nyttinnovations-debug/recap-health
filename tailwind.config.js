/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
      },
      colors: {
        recap: {
          bg: '#F0F4F8',
          surface: '#FFFFFF',
          border: 'rgba(0,0,0,0.08)',
          primary: '#1A73E8',
          'primary-light': 'rgba(26,115,232,0.08)',
          text: '#111827',
          muted: '#6B7280',
          stable: '#059669',
          'stable-light': 'rgba(5,150,105,0.08)',
          attention: '#B45309',
          'attention-light': 'rgba(180,83,9,0.08)',
          urgent: '#DC2626',
          'urgent-light': 'rgba(220,38,38,0.08)',
          purple: '#6D28D9',
          'purple-light': 'rgba(109,40,217,0.08)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(18px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        scaleIn: { '0%': { transform: 'scale(0.96)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
