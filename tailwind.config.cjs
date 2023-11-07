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
					primary: '#5959b0',
					warning: '#ff8c00'
				}
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=dark]'],
					primary: '#5959b0',
					warning: '#ff8c00'
				}
			},
			'night'
		]
	},

	plugins: [require('daisyui')]
};

module.exports = config;
