/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'foreground-rgb': 'rgb(var(--foreground-rgb))',
				'header-rgb': 'rgb(var(--header-rgb))',
				'background-rgb': 'rgb(var(--background-rgb))'
			}
		}
	},
	plugins: []
};
