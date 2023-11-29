import { FilbisAvatar } from '@/components/Filbis'
import { MenuBar } from './menu-bar'
import { auth } from '../api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { ChatForm } from './chat-form'
import { detectIntent, extractPromptAndChoices } from '@/lib/dialog-client'
import { PromptMessage } from './prompt-message'
import { cookies } from 'next/headers'
import { FilbisUpAvatar } from '@/components/Filbis-up'

async function getData() {
	const session = await auth()

	if (!session?.user?.email) {
		return redirect('/')
	}

	const res = await detectIntent(
		cookies().get('ss_id')?.value ?? session.user.email,
		'hello'
	)
	const { prompt, choices } = extractPromptAndChoices(res)

	if (!prompt)
		throw Error('Filbis is not feeling well right now. Come back later!')

	return {
		prompt,
		choices,
		image: session.user.image,
	}
}

export default async function ChatPage() {
	const { prompt, choices, image } = await getData()

	return (
		<>
			<div className="absolute top-0 -z-10 max-h-96 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 348"
					className="max-h-[inherit] w-full"
				>
					<path
						d="M-0.239255 82.5L0 -1L1281.5 -0.5V237C1260.5 86.5 671 133.5 -0.239255 82.5Z"
						fill="#408B51"
					/>
					<path
						d="M657 -0.74366C419 42.0152 146.5 170.5 -1 348L0 -1L657 -0.74366Z"
						fill="#2C6839"
					/>
				</svg>
			</div>
			<MenuBar src={image} />
			<section className="pt-16">
				<div className="grid w-full gap-40 md:container max-md:px-2">
					<PromptMessage
						className="max-w-prose text-center text-2xl/snug font-medium text-secondary-100 sm:text-3xl/snug md:text-4xl/normal"
						prompt={prompt}
					/>

					<div className="w-full max-w-screen-sm justify-self-center rounded-3xl bg-[#7CC089]">
						<div className="relative mx-auto grid w-full max-w-sm gap-y-8 rounded-3xl py-14">
							<FilbisUpAvatar className="absolute -top-36 left-[50%] -z-10 w-48  -translate-x-[50%]" />
							<ChatForm choices={choices} />
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
