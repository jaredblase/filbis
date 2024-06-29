import { MenuBar } from './menu-bar'
import { auth } from '../api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import { ChatForm } from './chat-form'
import { detectIntent, extractPromptAndChoices } from '@/lib/dialog-client'
import { PromptMessage } from './prompt-message'
import { cookies } from 'next/headers'
//import { FilbisUpAvatar } from '@/components/Filbis-up'
import { FilbisAvatar } from '@/components/Filbis'
import { SpeechToText } from './speech-to-text'

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
			<div className="bg-blue-800 absolute top-0 -z-10 h-screen min-w-full">

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
			<div className="relative flex items-center justify-center w-full h-full mt-[7vh] ">
				<div className="relative flex flex-col w-[80vw] h-full items-center justify-center"> 
					<div className=" flex items-center justify-center relative w-full sm:h-sm xs:h-xs">
							<FilbisAvatar className="relative flex justify-self-start w-[20vw] h-[20vh] -z-10 xl:block lg:block md:hidden sm:hidden xs:hidden"/>
							<div className="xl:ml-16 lg:ml-16 w-full h-full"> 
								<div className="bg-blue-500 rounded-3xl p-4 w-full h-full">
									{/*<p className="p-4 text-[#ED7042] text-max-w-prose text-center xl:text-6xl lg:text-6xl md:text-3xl sm:text-3xl xs:text-2xl font-shrikhand text-shadow-white tracking-wider" > FilBis </p> */}
									{/*<hr></hr>*/}
									<div className="flex items-center justify-center w-full h-full">
										<PromptMessage
											className="p-4 flex text-center items-center justify-center font-bold text-secondary-100 xl:text-4xl lg:text-4xl md:text-3xl sm:text-sm xs:text-xs "
											prompt={prompt}
											voice={voice}
										/>
									</div>
								</div>
							</div>
					</div>

					<ChatForm choices={choices} />

					<div className = "relative w-full mt-5">
						<hr className="relative border-t-4 border-gray-300 rounded-full w-full"></hr>
						<SpeechToText />
					</div>

					
				</div>
			</div>
		</>
	)
}
