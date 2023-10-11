import './globals.css'
import { googleSans } from '@/fonts/Google Sans'
import { shrikhand } from '@/fonts/Shrikhand'
import { ultra } from '@/fonts/Ultra'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Your Ultimate Health Chatbot for your Kids | Filbis',
	description: 'Filbis is your Ultimate Health Chatbot made for children. Developed by the students of De La Salle University and the Department of Science and Technology with ❤️.',
	themeColor: '#448C4A',
	manifest: '/manifest.webmanifest',
	applicationName: 'Filbis',
	generator: 'Next.js',
	keywords: ['chatbot', 'health', 'kids', 'philippines', 'dlsu'],
	openGraph: {
		images: {
			url: 'https://i.imgur.com/2spkaDw.png',
			type: 'image/png',
			width: 1200,
			height: 630,
		},
		type: 'website',
		siteName: 'Filbis',
		url: 'https://filbis.web.app',
	},
	twitter: {
		card: 'summary_large_image',
		images: {
			url: 'https://i.imgur.com/2spkaDw.png',
			type: 'image/png',
			width: 1200,
			height: 630,
		},
	}
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${googleSans.variable} ${ultra.variable} ${shrikhand.variable}`}>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<script src="https://kit.fontawesome.com/df3d7b7b50.js" crossOrigin="anonymous"></script>
			</head>
			<body className="bg-bg-400 min-h-screen grid items-center">
				<main>{children}</main>
			</body>
		</html>

	)
}