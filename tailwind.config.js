/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // The design system owns reset and component styles.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        primary: 'var(--ds-primary)',
        surface: 'var(--ds-surface)',
        ink: 'var(--ds-ink)',
        subtle: 'var(--ds-subtle)',
      },
    },
  },
  plugins: [],
};
