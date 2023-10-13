import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr/index'
import { FilbisAvatar } from '@/components/Filbis'
import { MenuBar } from './menu-bar'
import { auth } from '../api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
	const session = await auth()

	if (!session?.user) redirect('/')

	return (
		<>
			<div className="absolute top-0 -z-10 max-h-96 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 287"
					className="max-h-[inherit] w-full"
				>
					<path d="M-1 45.5V-0.5L1280.5 0V176L-1 45.5Z" fill="#215386" />
					<path d="M523 -1L0 287V-1H523Z" fill="#306CA8" />
				</svg>
			</div>
			<MenuBar src={session.user.image} />
			<section>
				<div className="container grid w-full gap-x-16 lg:grid-cols-2">
					<div>
						<p className="h1 with-shadow mb-4 text-center">What language?</p>
						<FilbisAvatar className="center mx-auto w-full max-w-md" />
					</div>
					<div className="grid place-items-center rounded-3xl">
						<div className="grid w-full max-w-md gap-y-12">
							<p className="text-center text-xl font-medium text-secondary-100">
								Click anything or type in the chatbox.
							</p>
							<div className="flex flex-col gap-y-3 text-xl">
								<button className="btn btn-primary w-full">English</button>
								<button className="btn btn-primary w-full">Filipino</button>
								<button className="btn btn-primary w-full">Bisaya</button>
							</div>
							<form className="flex w-full items-center gap-x-2">
								<div className="relative flex-1">
									<input
										type="text"
										className="w-full rounded-full bg-white/50"
										placeholder="Type anything here!"
									/>
								</div>
								<button className="w-10 py-1">
									<PaperPlaneRight className="icon" />
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
