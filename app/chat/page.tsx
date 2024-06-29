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
			<div className="relative flex items-center justify-center w-full h-full xl:mt-20 lg:mt-20 md:mt-20 ">
				<div className="relative flex flex-col w-[70vw] items-center justify-center"> 
					<div className="relative w-full ">
						<div className="flex w-full">
							<FilbisAvatar className="relative flex justify-self-start w-[20vw] h-[20vh] -z-10 xl:block lg:block md:hidden sm:hidden xs:hidden"/>
							<div className="bg-blue-500 xl:ml-16 lg:ml-16 flex items-center justify-center rounded-3xl p-4 w-full  ">
								{/*<p className="p-4 text-[#ED7042] text-max-w-prose text-center xl:text-6xl lg:text-6xl md:text-3xl sm:text-3xl xs:text-2xl font-shrikhand text-shadow-white tracking-wider" > FilBis </p> */}
								{/*<hr></hr>*/}
								<div className="flex items-center justify-center w-full">
									<PromptMessage
										className="p-4 flex text-center items-center justify-center font-bold text-secondary-100 xl:text-4xl lg:text-4xl md:text-3xl sm:text-3xl xs:text-2xl "
										prompt={prompt}
										voice={voice}
									/>
								</div>
								
							</div>
						</div>
					</div>

					<div className = "relative w-full h-fit justify-center items-center flex mt-6 mb-6">	
						<div className="min-w-full h-full relative flex flex-col justify-center gap-y-6 rounded-3xl ">
							<ChatForm choices={choices} />
						</div>
					</div>
					
				</div>
			</div>
		</>
	)
}
