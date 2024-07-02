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
import { useVoiceToText } from "react-speakup"
import FormDataAddon from 'wretch/addons/formData'

export function SpeechToText() {
	var bRecording = false;
	const { startListening, stopListening, transcript } = useVoiceToText()
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
		// Mic is CURRENTLY recording
		if (bRecording) {
			// Stop mic to listen
			bRecording = false;
			stopListening()
			
			return transcript
			//return stop().then(() => form.current?.requestSubmit())
		} else {
			// If not recording, start voice recording
			// start()
			bRecording = true;
			startListening()
		}
	}
	return (
		<>
			<form className="relative w-full mt-5" onSubmit={handleSpeechToTextSubmit} ref={form}>
				<div className="relative flex w-full items-center gap-x-2 max-sm:px-2">
						<div className="relative flex-1">
							<input
								type="text"
								className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
								placeholder="Type anything here!"
								name="text"
								ref={input}
								value={transcript}
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