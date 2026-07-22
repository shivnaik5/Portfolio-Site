module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.js', './components/**/*.js'],
  corePlugins: {
    preflight: false,
    container: false,
  },
  theme: {
    extend: {
      colors: {
        background: '#0b0e17',
        surface: '#131824',
        border: '#232a3a',
        foreground: '#e6e9f0',
        muted: '#7b8496',
        accent: '#dba919',
        'code-keyword': '#c792ea',
        'code-string': '#dba919',
        'code-comment': '#7b8496',
        'code-fn': '#82aaff',
      },
      fontFamily: {
        sans: ['Cambay', 'Montserrat', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(25px) translateY(-30px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        sway: 'sway 15s linear infinite',
        blink: 'blink 1s step-end infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
