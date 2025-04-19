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
		  'wellsphere-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
		  'wellsphere': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		  'wellsphere-md': '0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 5px -1px rgba(0, 0, 0, 0.06)',
		  'wellsphere-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		},
		borderRadius: {
		  'zendenta': '10px',
		  'wellsphere-sm': '0.375rem',  /* 6px */
		  'wellsphere': '0.5rem',      /* 8px */
		  'wellsphere-md': '0.75rem',   /* 12px */
		  'wellsphere-lg': '1rem',      /* 16px */
		  'wellsphere-xl': '1.5rem',    /* 24px */
		},
		transitionDuration: {
		  '400': '400ms',
		},
		animation: {
		  'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		},
		zIndex: {
		  'dropdown': '50',
		  'modal': '100',
		  'tooltip': '60',
		},
	  },
	},
	plugins: [],
  }