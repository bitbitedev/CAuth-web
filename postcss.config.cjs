const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');
const nestedProps = require('postcss-nested-props');
const nestedAncestors = require('postcss-nested-ancestors');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		nested(),
		nestedProps(),
		nestedAncestors(),
		tailwindcss(),
		autoprefixer
	]
};

module.exports = config;