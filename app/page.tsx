import { FilbisAvatar } from '@/components/Filbis'
import { auth } from './api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { LoginButton } from './login-button'

export default async function HomePage() {
	const session = await auth()

	if (session?.user) redirect('/chat')

	return (
		<>
			<div className="bg-blue-800 absolute top-0 -z-10 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 348"
					className="bg-blue-800 h-full w-full"
				>
					<path
						d="M 0 45 L 0 0 L 1281.5 -0.5 v 49.5 C 606 -51 466 196 0 45 Z"
						fill="#5E99F7"
					/>
				</svg>
			</div>
			<div className="flex items-center justify-center min-h-screen">
				<div className="relative text-secondary-100 w-full text-center bottom-[14vh]">
					{/* <div className="mx-auto mb-6 w-fit rounded-3xl bg-primary-400 px-10 py-5">
						<p className="text-center font-shrikhand text-3xl">Welcome back!</p>
					</div> */}
					<h1 className="h1 with-shadow pb-5 lg:text-8xl md:text-6xl sm:text-4xl xs:text-4xl">So, how are you?</h1>
					<LoginButton />
					<FilbisAvatar className="center m-auto h-[30vh] mt-4" />
				</div>
			</div>
		</>
	)
}
