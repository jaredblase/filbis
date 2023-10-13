import { FilbisAvatar } from '@/components/Filbis'
import { HomeMenu } from './home-menu'
import { auth } from './api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
	const session = await auth()

	if (session?.user) redirect('/chat')

	return (
		<>
			<div className="absolute top-0 -z-10 h-screen w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 832"
					className="h-full w-full"
				>
					<path d="M0 0H1280V59L0 384V0Z" fill="#215386" />
					<path d="M0 832H392L0 384V832Z" fill="#306CA8" />
				</svg>
			</div>
			<HomeMenu />
			<section className="text-secondary-100">
				<div className="mx-auto mb-6 w-fit rounded-3xl bg-primary-400 px-10 py-5">
					<p className="text-center font-shrikhand text-3xl">Welcome back!</p>
				</div>
				<h1 className="h1 with-shadow text-center">So, how are you?</h1>
				<FilbisAvatar className="center m-auto w-[75%] max-w-lg" />
			</section>
		</>
	)
}
