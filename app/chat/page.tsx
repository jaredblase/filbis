import { FilbisAvatar } from '@/components/Filbis'
import { MenuBar } from './menu-bar'
import { auth } from '../api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { ChatForm } from './chat-form'

export default async function ChatPage() {
	const session = await auth()

	if (!session?.user) redirect('/')

	return (
		<>
			<div className="absolute top-0 -z-10 max-h-96 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 348"
					className="max-h-[inherit] w-full"
				>
					<path d="M-0.239255 82.5L0 -1L1281.5 -0.5V237C1260.5 86.5 671 133.5 -0.239255 82.5Z" fill="#408B51"/>
					<path d="M657 -0.74366C419 42.0152 146.5 170.5 -1 348L0 -1L657 -0.74366Z" fill="#2C6839"/>
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
						<ChatForm />
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
