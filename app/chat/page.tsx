import { MenuBar } from './menu-bar'
import { auth } from '../api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { ChatForm } from './chat-form'
import { detectIntent, extractPromptAndChoices } from '@/lib/dialog-client'
import { PromptMessage } from './prompt-message'
import { cookies } from 'next/headers'
//import { FilbisUpAvatar } from '@/components/Filbis-up'
import { FilbisAvatar } from '@/components/Filbis'

async function getData() {
	const session = await auth()

	if (!session?.user?.email) {
		return redirect('/')
	}

	const res = await detectIntent(
		cookies().get('ss_id')?.value ?? session.user.email,
		'hello'
	)
	const { prompt, choices, voice } = extractPromptAndChoices(res)

	if (!prompt)
		throw Error('Filbis is not feeling well right now. Come back later!')

	return {
		prompt,
		voice,
		choices,
		image: session.user.image,
	}
}

export default async function ChatPage() {
	const { prompt, choices, voice, image } = await getData()

	return (
		<>
			<div className="bg-blue-800 absolute top-0 -z-10 min-h-screen max-h-96 w-full">

				<svg
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					viewBox="0 0 1280 348"
					className="bg-blue-800 h-screen w-full"
				>
					<path
						d="M 0 45 L 0 0 L 1281.5 -0.5 v 49.5 C 614 -58 766 119 0 45 Z"
						fill="#5E99F7"
						//fill="#1D4FD7"
					/>
					
				</svg>
			
			</div>
			<MenuBar src={image} />
			<section className="flex items-center justify-center min-h-[82vh] w-full">
				<div className="relative grid w-full md:container max-md:px-2">

					<FilbisAvatar className="absolute xl:left-12 xl:top-20 xl:block xl:w-1/3 lg:block lg:left-12 lg:top-36 lg:w-1/3 -z-10 hidden md:hidden sm:hidden xs:hidden"/>

					<div className="xl:justify-self-end lg:justify-self-end rounded-3xl">
						<div className = "mx-auto w-full max-w-xs flex xl:justify-end lg:justify-end">
							<div className="grid w-full max-w-xs gap-y-8 rounded-3xl py-14 ">
								<ChatForm choices={choices} />
							</div>
						</div>
					</div>
					
					<div className="bg-blue-500 w-full max-w-screen-xl justify-self-center rounded-3xl p-[18px]">
						<p className="p-4 text-yellow-300 text-max-w-prose text-center text-2xl/snug font-bold text-secondary-100 sm:text-3xl/snug md:text-4xl/normal" > FilBis </p>
						<hr></hr>
						<PromptMessage
							className="p-4 max-w-prose text-center text-2xl/snug font-normal text-secondary-100 sm:text-3xl/snug md:text-4xl/normal"
							prompt={prompt}
							voice={voice}
						/>
					</div>

				</div>
			</section>
		</>
	)
}
