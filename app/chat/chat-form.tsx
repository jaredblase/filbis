'use client'

/*
	chat-form.tsx
	> Ito ung file for the whole conversation. 
	  Dito makikita kung paano pinaprocess kapag nag susubmit ng prompt ung user sa chatbot (IN GENERAL VIEW)

	IN Chatbot Data Cycle (https://docs.google.com/document/d/1QEsU5feIJyWrt0QA9Xbor6xMfkNKihGgFcfttmGEcJQ/edit#heading=h.hrr6iaj9ojqr)
	- Chat Interface (WE ARE AT THIS PART) <-> Dialogflow CX <-> Fulfillment Server
*/


// LIBRARY IMPORTS
/*
	Imports 2 icons from a library called Phosphor-Icons
	- PaperPlaneRight: Icon
	- Microphone: Icon
*/ 
import { PaperPlaneRight, Microphone } from '@phosphor-icons/react/dist/ssr/index' 


/*
	A function from NextJS Framework
	- Redirect: Allows to redirect to an URL.
		How to use: redirect('<URL>')
*/
import { redirect } from 'next/navigation'


/*
	4 Functions from React Library
	- FormEventHandler: Ito nag hahandle kapag ISUSUBMIT na ung Forms
	- MouseEventHandler: For any mouse events
	React Hooks (https://www.w3schools.com/react/react_useref.asp)
	- useEffect: 
	- useRef: 
*/
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react'


/*
	A function from a library (https://github.com/elbywan/wretch)
	- wretch: a fetch function but better and easier
*/
import wretch from 'wretch'


/*

	3 functions from store.tsx
	- useChatActions: Para magamit tong mga to (setPrompt, setChoices, setHelpText, setVoice, toggleMute)
	- useChoices: Para magamit ung (title and payload)
	- useHelpText: Para magamit ung ('Click anything or type in the chatbox.') na dialog pang display

*/
import { useChatActions, useChoices, useHelpText } from './store'


/*
	2 functions from DialogFlowCX
	- Choice: Para makuha ung Title (for front-end purposes) and Payload (for intent purposes)
	- extractPromptAndChoices: Laman nito ung mga reply ng DialogFlowCX sa Client Request
*/
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'


/*
	Para Audio and Microphone Recorder (For Speech Recognition) (https://github.com/orizens/use-recorder)
*/
import { useRecorder } from '@/lib/use-recorder'


/*
	For stating when to load the app.
*/
import { useLoading } from '@/lib/use-loader'


/*
	Para dun sa gumagalaw na tuldok sa screen tuwing nag loloading.
*/
import { Spinner } from '@/components/spinner'


/*

*/
import FormDataAddon from 'wretch/addons/formData'


type ChatFormProps = {
	choices: Array<Choice>
}

// Ito na ung buong pag process ung user input papunta sa Dialogflow CX
// This returns ChatFormProps (Title and Payload)
export function ChatForm({ choices }: ChatFormProps) {
	const { setPrompt, setChoices, setHelpText, setVoice } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData, isRecording } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const helpText = useHelpText()

	// useEffect is a React Hook that lets you synchronize a component with an external system. (https://react.dev/reference/react/useEffect)
	// Put choices(title and payload) all inside setChoices and run it only once because of "[]"
	// If dependency is empty "[]", "An Effect with empty dependencies doesn’t re-run when any of your component’s props or state change."
	// https://react.dev/reference/react/useEffect#specifying-reactive-dependencies
	useEffect(() => setChoices(choices), [])

	
	// This function is called when the user submits the form or presses the send button.
	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {

		// Preventing to reload the page
		e.preventDefault()

		// Get the current inputs in the form only when it is not null
		const formData = new FormData(form.current!)

		// Get the current voice recording if there is any (nag rereturn lang to kapag may audio na narecord)
		const file = getFile()

		// If walang laman ung input, remove it from the form data
		if (formData.get('text') === '') {
			formData.delete('text')
		}

		// If may audio na narecord, append it to the form data
		if (file) {
			formData.append('audio', file)
			clearData()
		}

		// If the length of the input is 0, set the help text to 'Payload cannot be empty!'
		if (!Array.from(formData.keys()).length) {
			return setHelpText('Payload cannot be empty!')
		}

		// Start the loading spinner (ito ung tatlong dots na naandar)
		loading.start()

		// Gawin "Loading..." ung taas ng mga choices sa UI
		setHelpText('Loading...')

		// max 3 attempts in case of gateway timeout
		for (let i = 0; i < 3; i++) {

			// Post request to the /api/chat which is the endpoint for the DialogFlowCX
			const res = await wretch('/api/chat')
				.addon(FormDataAddon)
				.formData(Object.fromEntries(formData))
				.post()
				.badRequest(() => setHelpText('Invalid response. Please try again.')) // If bad request, display this message
				.unauthorized(() => redirect('/')) // If unauthorized, redirect to the homepage
				.internalError(res => setHelpText(res.json))
				.error(504, () =>
					// gateway timeout, vercel limitations
					setHelpText('Request timeout. Attempting to resend request...')
				)
				.json<ReturnType<typeof extractPromptAndChoices>>()

			// If the response from DialogFlowCX is not null, set the prompt, voice, and choices.
			if (res) {
				setPrompt(res.prompt ?? '') // Ito ung Loading... sa taas ng mga choices, idisplay hanggang mag reply ung DialogFlowCX
				setVoice(res.voice) // Ito ung naririnig na voice over kapag nag rereply ung DialogFlowCX
				setChoices(res.choices) // Ito ung mga choices na ipapakita sa UI, naka depende kung ano ung reply ng DialogFlowCX

				if (!res.prompt?.includes('again')) {
					form.current?.reset()
				}
				
				setHelpText('Click anything or type in the chatbox.') // Ito ung default na text na lalabas sa UI kapag may new choices
				break
			}
		}
		
		// Stop the loading spinner
		loading.stop()
	}

	/*
		If person uses Speech Recognition (Cinlick ung mic sa chat box) and NAG RERECORD CURRENTLY ung voice, stop recording after i-click ulit.
	*/
	async function handleMicClick() {
		// Mic is CURRENTLY recording
		if (isRecording) {
			// Stop mic to listen
			return stop().then(() => form.current?.requestSubmit())
		}
		
		// If not recording, start voice recording
		start()
	}

	/*
		Kapag may pinili sa choices si user, un ung gagamitin for the requestSubmit() function.
	*/
	const handleChoiceClick: MouseEventHandler = e => {
		if (!input.current) return
		input.current.value = (e.target as HTMLButtonElement).value
		form.current?.requestSubmit()
	}

	// This is the UI of the whole green square chat box (ito ung kasama ung choices at chat box)
	return (
		<>
			{/*<p className="text-center text-xl font-medium text-secondary-100">
				{helpText}
			</p>*/}
			<form className="w-full h-full " onSubmit={handleSubmit} ref={form}>
					<fieldset disabled={loading.submitting}>
					{loading.delayed ? (
					<Spinner className="mx-auto" />
					) : (
					<>
						{storedChoices.length > 0 && (
						<div className="flex justify-center h-[30vh] flex-wrap xl:flex-col xl:gap-y-3 lg:flex-col lg:gap-y-3 md:flex-col md:gap-y-3 sm:flex-col sm:gap-3 xs:flex-col xs:gap-3 overflow-y-auto overflow-x-auto scroll scroll-smooth scrollbar-thin first-letter:text-xl max-sm:px-2">
							{storedChoices.map(choice => (
							<button
								key={choice.payload}
								type="button"
								className="bg-[#e26b3f] hover:bg-[#d85424] text-white border-b-4 border-white hover:border-white rounded-full btn xl:text-xl lg:text-lg md:text-md sm:text-sm xs:text-xs"
								value={choice.payload}
								onClick={handleChoiceClick}
							>
								{choice.title}
							</button>
							))}
						</div>
						)}
					</>
					)}
				</fieldset>
				
				<input
					type="text"
					className="hidden"
					placeholder="Type anything here!"
					name="text"
					ref={input}
				/>
			</form>
			
			<form className="w-full h-full " onSubmit={handleSubmit} ref={form}>
				<div className="flex w-full items-center gap-x-2 max-sm:px-2">
						<div className="relative flex-1">
							<input
								type="text"
								className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
								placeholder="Type anything here!"
								name="text"
								ref={input}
							/>
							<button
								className={`btn duration-[1.25s] absolute inset-y-0 right-2 my-auto aspect-square rounded-full p-1.5 transition-colors ${
									isRecording ? 'btn-primary animate-pulse' : ''
								}`}
								type="button"
								onClick={handleMicClick}
							>
								<Microphone className="icon" />
							</button>
						</div>
					<button className="btn w-10 p-0">
						<PaperPlaneRight className="icon" />
					</button>
				</div>
			</form>

		</>
	)
}
