import { FilbisAvatar } from '@/components/Filbis'
import { auth } from './api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { LoginButton } from './login-button'

export default async function HomePage() {
	const session = await auth()

	if (session?.user) redirect('/chat')

	return (
		<>
			<div className="bg-blue-800 absolute top-0 -z-10 h-screen max-h-96 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 832"
					className="bg-blue-800 h-screen w-full"
				>
					<path
						d="M 0 0 H 1280 V 59 C 1280 59 144 480 0 141 Z"
						fill="#5E99F7"
					/>
					<path
						d="M0 832H675.5C399.73 774.766 30.365 676.747 0 384C0 558.955 0 832 0 832Z"
						fill="#1D4FD7"
					/>
				</svg>
			</div>
			<section className="text-secondary-100">
				{/* <div className="mx-auto mb-6 w-fit rounded-3xl bg-primary-400 px-10 py-5">
					<p className="text-center font-shrikhand text-3xl">Welcome back!</p>
				</div> */}
				<h1 className="h1 with-shadow pb-5 text-center">So, how are you?</h1>
				<LoginButton />
				<FilbisAvatar className="center m-auto w-[60%] max-w-lg mt-4" />
			</section>
		</>
	)
}
