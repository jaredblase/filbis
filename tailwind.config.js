const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '1em',
		},
		screens: {
			xs: '360px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		extend: {
			fontFamily: {
				primary: 'var(--font-google)',
				shrikhand: 'var(--font-shrikhand)',
				ultra: 'var(--font-ultra)',
			},
			colors: {
				tertiary: {
					50: '#f8f8f8',
					100: '#ededed',
					200: '#dcdcdc',
					300: '#bdbdbd',
					400: '#989898',
					500: '#7c7c7c',
					600: '#656565',
					700: '#525252',
					800: '#464646',
					900: '#3d3d3d',
					950: '#292929',
				},
				blue: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#c0dbfd',
					300: '#94c5fc',
					400: '#62a5f8',
					500: '#4285f4',
					600: '#2763e9',
					700: '#1f4ed6',
					800: '#2041ad',
					900: '#1f3b89',
					950: '#182553',
				},
				bg: {
					50: '#f4f9f4',
					100: '#e5f3e6',
					200: '#cbe7cd',
					300: '#a3d2a7',
					400: '#72b678',
					500: '#4e9955',
					600: '#448c4a',
					700: '#326336',
					800: '#2c4f2f',
					900: '#254229',
					950: '#102313',
				},
				primary: {
					50: '#fef4ee',
					100: '#fce6d8',
					200: '#f8cab0',
					300: '#f3a57e',
					400: '#ed7042',
					500: '#e95326',
					600: '#db3a1b',
					700: '#b52a19',
					800: '#91241b',
					900: '#752019',
					950: '#3f0d0b',
				},
				secondary: {
					50: '#fbf7f1',
					100: '#f4e8d8',
					200: '#ecd6bc',
					300: '#dfb992',
					400: '#d19666',
					500: '#c77c48',
					600: '#b9673d',
					700: '#9a5234',
					800: '#7c4330',
					900: '#653829',
					950: '#361b14',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'base',
		}),
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.text-shadow': {
					'text-shadow':
						'var(--tw-text-shadow-x) var(--tw-text-shadow-y) var(--tw-shadow-color)',
				},
			})
		}),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'text-shadow-x': value => ({ '--tw-text-shadow-x': value }),
					'text-shadow-y': value => ({ '--tw-text-shadow-y': value }),
				},
				{ values: theme('spacing') }
			)
		}),
	],
}
