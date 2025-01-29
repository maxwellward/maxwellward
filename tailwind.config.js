/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#13111c',
				secondary: '#1f1d29',
				card: '#181622',
				cardborder: '#1F1D27',
				type: {
					primary: '#FFFFFF',
					secondary: '#666270',
				},
			},
			scale: {
				101: '1.01',
				102: '1.02',
				103: '1.03',
				104: '1.04',
			},
			backgroundSize: {
				400: '400%',
			},
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
