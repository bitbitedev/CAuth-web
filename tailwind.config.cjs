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
					warning: '#ff8c00',
					success: '#4CA64C',
				}
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=dark]'],
					primary: '#5959b0',
					warning: '#ff8c00',
					success: '#4CA64C',
				}
			},
			'night'
		]
	},

	plugins: [require('daisyui')]
};

module.exports = config;
