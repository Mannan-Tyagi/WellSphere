/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx}",
	  "./pages/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	  "./modules/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  'zendenta': {
			primary: '#06B6D4', // Teal color
			secondary: '#4A6572',
			accent: '#F9A826',
			positive: '#34D399',
			danger: '#F87171',
			warning: '#FBBF24',
		  },
		},
		fontFamily: {
		  'sans': ['Montserrat', 'ui-sans-serif', 'system-ui'],
		  'serif': ['Playfair Display', 'ui-serif', 'Georgia'],
		  'display': ['Poppins', 'Montserrat', 'sans-serif'],
		},
		boxShadow: {
		  'zendenta': '0 4px 12px rgba(0, 0, 0, 0.05)',
		  'zendenta-lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
		},
		borderRadius: {
		  'zendenta': '10px',
		},
		transitionDuration: {
		  '400': '400ms',
		},
		animation: {
		  'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		},
	  },
	},
	plugins: [],
  }