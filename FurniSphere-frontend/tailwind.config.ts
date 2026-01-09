import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    'globals.css',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-bg': "url('/static/images/heroImage.png')",
        'login-bg': "url('/static/images/loginImage2.png')",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#8B7355', // Warm brown - elegant, furniture-inspired
          secondary: '#F5F1EB', // Warm beige - soft backgrounds
          accent: '#D4A574', // Golden tan - accents and highlights
          neutral: '#6B6B6B', // Charcoal gray - text and borders
          'base-100': '#FAFAFA', // Off-white - clean base background
          'base-200': '#FFFFFF', // Pure white - cards and surfaces
          'base-300': '#E8E5E0', // Light beige - borders and dividers
          info: '#4A90E2', // Soft blue - informational
          success: '#5CB85C', // Green - success states
          warning: '#F0AD4E', // Amber - warnings
          error: '#D9534F', // Red - errors
        },
      },
    ],
  },
};
export default config;
