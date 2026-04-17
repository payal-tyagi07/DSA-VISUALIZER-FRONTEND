// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        'code-bg': '#1e1e1e',
        'code-sidebar': '#252526',
        'code-accent': '#007acc',
        'code-green': '#6a9955',
        'code-yellow': '#dcdcaa',
        'code-blue': '#569cd6',
        'code-purple': '#c586c0',
        'code-orange': '#ce9178',
      },
    },
  },
  plugins: [],
};