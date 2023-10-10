import localFont from 'next/font/local'

export const googleSans = localFont({
	src: [
		{
			path: '400.ttf',
			weight: '400',
		},
		{
			path: '500.ttf',
			weight: '500',
		},
	],
	display: 'swap',
	variable: '--font-google'
})
