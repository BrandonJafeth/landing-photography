/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Work Sans', 'sans-serif'],
			},
			colors: {
				dark: '#0d0d0d',
				light: '#ffffff',
			},
		},
	},
	plugins: [],
}
