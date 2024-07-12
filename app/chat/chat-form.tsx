'use client'

/*
	chat-form.tsx
	> Ito ung file for the whole conversation. 
	  Dito makikita kung paano pinaprocess kapag nag susubmit ng prompt ung user sa chatbot (IN GENERAL VIEW)

	IN Chatbot Data Cycle (https://docs.google.com/document/d/1QEsU5feIJyWrt0QA9Xbor6xMfkNKihGgFcfttmGEcJQ/edit#heading=h.hrr6iaj9ojqr)
	- Chat Interface (WE ARE AT THIS PART) <-> Dialogflow CX <-> Fulfillment Server
*/
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText, useLanguage } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'
import FormDataAddon from 'wretch/addons/formData'


type ChatFormProps = {
	choices: Array<Choice>
}

export function ChatForm({ choices }: ChatFormProps) {
	const { setPrompt, setChoices, setHelpText, setLanguage, setVoice } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData, isRecording } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)

	// useEffect is a React Hook that lets you synchronize a component with an external system. (https://react.dev/reference/react/useEffect)
	// Put choices(title and payload) all inside setChoices and run it only once because of "[]"
	// If dependency is empty "[]", "An Effect with empty dependencies doesn’t re-run when any of your component’s props or state change."
	// https://react.dev/reference/react/useEffect#specifying-reactive-dependencies
	useEffect(() => setChoices(choices), [])

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {

		e.preventDefault()

		const formData = new FormData(form.current!)

		const file = getFile()

		if (formData.get('text') === '') {
			formData.delete('text')
		}

		if (file) {
			formData.append('audio', file)
			clearData()
		}

		if (!Array.from(formData.keys()).length) {
			return setHelpText('Payload cannot be empty!')
		}

		loading.start()

		setHelpText('Loading...')

		for (let i = 0; i < 3; i++) {

			const res = await wretch('/api/chat')
				.addon(FormDataAddon)
				.formData(Object.fromEntries(formData))
				.post()
				.badRequest(() => setHelpText('Invalid response. Please try again.')) 
				.unauthorized(() => redirect('/')) 
				.internalError(res => setHelpText(res.json))
				.error(504, () =>
					setHelpText('Request timeout. Attempting to resend request...')
				)
				.json<ReturnType<typeof extractPromptAndChoices>>()

			if (res) {
				setPrompt(res.prompt ?? '')
				setVoice(res.voice) 
				setChoices(res.choices) 

				if (!res.prompt?.includes('again')) {
					form.current?.reset()
				}

				if (res.language == "tagalog"){
					setLanguage("Mag-type ng kahit ano dito!")
				} else if ( res.language == "cebuano"){
					setLanguage("Diri ka musuwat!")
				} else{
					setLanguage("Type anything here!")
				}
				
				break
			}
		}
		
		loading.stop()
	}

	const handleChoiceClick: MouseEventHandler = e => {
		if (!input.current) return
		input.current.value = (e.target as HTMLButtonElement).value
		form.current?.requestSubmit()
	}

	return (
		<>
			{storedChoices.length > 0 && (
				<div className = "relative w-full h-[30vh] justify-center items-center flex flex-col mt-5">	
					<div className="min-w-full h-full relative flex flex-col justify-center gap-y-6 rounded-3xl ">
						<form className="relative w-full h-full" onSubmit={handleSubmit} ref={form}>
								<fieldset className="relative w-full h-full" disabled={loading.submitting}>
								{loading.delayed ? (
								<Spinner className="mx-auto" />
								) : (
								<>
									<div className="relative flex h-full w-full xl:flex-wrap xl:flex-col xl:gap-y-3 lg:flex-wrap lg:flex-col lg:gap-y-3 md:flex-wrap md:flex-col md:gap-y-3 sm:flex-col sm:gap-3 xs:flex-col xs:gap-3 xs:flex-nowrap overflow-y-auto overflow-x-auto scroll scroll-smooth scrollbar-thin first-letter:text-xl max-sm:px-2">
										{storedChoices.map(choice => (
											<button
												key={choice.payload}
												type="button"
												className="relative bg-[#e26b3f] hover:bg-[#d85424] text-white border-b-4 border-white hover:border-white rounded-full btn xl:text-md lg:text-lg md:text-md sm:text-sm xs:text-xs"
												value={choice.payload}
												onClick={handleChoiceClick}
											>
												{choice.title}
											</button>
										))}
									</div>
								</>
								)}
							</fieldset>
							
							<input
								type="text"
								className="hidden"
								placeholder= "Type anything here!"
								name="text"
								ref={input}
							/>
						</form>
					</div>
				</div>
			)}

		</>
	)
}
