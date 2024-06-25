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
			<section className="relative flex items-center justify-center min-h-[80vh] min-w-[70vw]">
				<div className="relative grid w-full md:container max-md:px-2">

					<div className="rounded-3xl w-full">
						<div className="flex w-full">
							<FilbisAvatar className="relative flex justify-self-start w-[30vw] -z-10 xl:block lg:block md:block sm:hidden xs:hidden"/>

							<div className = "relative w-full justify-center flex">
								<div className="relative flex ml-auto w-full xl:justify-end lg:justify-end md:justify-end sm:justify-center xs:justify-center gap-y-8 rounded-3xl pb-4 ">
									<ChatForm choices={choices} />
								</div>
							</div>

						</div>
					</div>
					
					<div className="bg-blue-500 w-full max-w-[70vw] justify-self-center rounded-3xl p-4">
						<p className="p-4 text-[#ED7042] text-max-w-prose text-center xl:text-6xl lg:text-6xl md:text-3xl sm:text-3xl xs:text-2xl font-shrikhand text-shadow-white tracking-wider" > FilBis </p>
						<hr></hr>
						<PromptMessage
							className="p-4 max-w-prose text-center font-bold text-secondary-100 xl:text-3xl lg:text-xl md:text-xl sm:text-xl "
							prompt={prompt}
							voice={voice}
						/>
					</div>

				</div>
			</section>
		</>
	)
}
