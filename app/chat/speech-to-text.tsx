'use client'

import { IconContext, PaperPlaneRight, Microphone } from '@phosphor-icons/react' 
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText, useLanguage, useIsVoiceMuted } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'
import FormDataAddon from 'wretch/addons/formData'

export function SpeechToText() {
	const { setPrompt, setChoices, setHelpText, setVoice } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData, isRecording } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const helpText = useHelpText()
	const placeHolderTranslate = useLanguage()
	const isVoiceMuted = useIsVoiceMuted()

	// This function is called when the user submits the form or presses the send button.
	const handleSpeechToTextSubmit: FormEventHandler<HTMLFormElement> = async e => {

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

				break

			}
		}

		loading.stop()
	}

	async function handleMicClick() {
		if (isRecording) {
			return stop().then(() => form.current?.requestSubmit())
		}
		
		start()
	}
	return (
		<>
			{/*((storedChoices.length == 0 && isVoiceMuted == false) || (storedChoices.length > 0 && isVoiceMuted == false))*/}
			{ storedChoices.length == 0 && (
				<form className="relative w-full mt-5" onSubmit={handleSpeechToTextSubmit} ref={form}>
					<hr className="relative border-t-4 border-gray-300 rounded-full w-full mb-9"></hr>
					<div className="relative flex w-full items-center gap-x-2 max-sm:px-2">
							<div className="relative flex-1">
								<input
									id="free_input"
									type="text"
									className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
									placeholder={placeHolderTranslate}
									name="text"
									ref={input}
								/>
								<IconContext.Provider value={{size: 36}}>
									<button
										className={`btn duration-[1.25s] absolute inset-y-0 right-2 my-auto aspect-square rounded-full p-1.5 transition-colors ${
											isRecording ? 'btn-primary animate-pulse' : ''
										}`}
										type="button"
										onClick={handleMicClick}
									>
										<Microphone className="icon" />
									</button>
								</IconContext.Provider>
							</div>
						<IconContext.Provider value={{size: 36}}>
							<button className="btn w-10 p-0">
								<PaperPlaneRight className="icon" />
							</button>
						</IconContext.Provider>
					</div>
				</form>
			)}
		</>
	)
}