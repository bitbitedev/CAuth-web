const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['[data-theme=light]'],
					primary: '#427FED'
				}
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=dark]'],
					primary: '#427FED'
				}
			},
			'night'
		]
	},

	plugins: [require('daisyui')]
};

module.exports = config;