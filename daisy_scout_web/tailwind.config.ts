import {
  content as flowbyteContent,
  plugin as flowbytePlugin,
} from 'flowbite-react/tailwind';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    flowbyteContent(),
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        daisy: {
          primary: {
            darkblue: '#00517E',
            lightblue: '#0086CB',
            yellow: '#FBDC0A',
            white: '#FFFFFF',
          },
          secondary: {
            cream: '#FFF6C9',
            green: '#3A9525',
            gray: '#D8D8D8',
            black: '#000000',
          },
        },
      },
    },
  },
  plugins: [flowbytePlugin()],
} satisfies Config;
