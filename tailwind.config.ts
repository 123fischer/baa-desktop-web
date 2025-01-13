import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      screens: {
        lg: '1140px',
      },
    },
    extend: {
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        dark: {
          DEFAULT: 'var(--color-dark)',
        },
        'light-dark': 'var(--color-light-grey)',
        neutral: {
          tint: 'var(--color-neutral-tint)',
          DEFAULT: 'var(--color-neutral)',
          shade: 'var(--color-neutral-shade)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          tint: 'var(--color-success-tint)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          tint: 'var(--color-error-tint)',
        },
      },
      // keyframes: {
      //   'accordion-down': {
      //     from: {
      //       height: '0',
      //     },
      //     to: {
      //       height: 'var(--radix-accordion-content-height)',
      //     },
      //   },
      //   'accordion-up': {
      //     from: {
      //       height: 'var(--radix-accordion-content-height)',
      //     },
      //     to: {
      //       height: '0',
      //     },
      //   },
      // },
      // animation: {
      //   'accordion-down': 'accordion-down 0.2s ease-out',
      //   'accordion-up': 'accordion-up 0.2s ease-out',
      // },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
