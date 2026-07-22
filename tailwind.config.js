module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: '#FBF7F1',
        surface: '#F1E7DA',
        foreground: '#2B2420',
        muted: '#7A6C5D',
        accent: '#3F6C63',
        'accent-warm': '#C97B2E',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadein: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        refill: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadein: 'fadein 0.6s ease-out forwards',
        refill: 'refill 400ms ease-out',
      },
    },
  },
  plugins: [],
};
