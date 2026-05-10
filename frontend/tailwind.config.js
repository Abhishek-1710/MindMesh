export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        neural: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#161e3a',
          600: '#1e2a4a',
        }
      }
    }
  },
  plugins: []
}