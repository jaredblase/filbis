'use client'

import { PaperPlaneRight, Microphone } from '@phosphor-icons/react/dist/ssr/index' 
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'
import { useVoiceToText } from "react-speakup"
import FormDataAddon from 'wretch/addons/formData'

export function SpeechToText() {
	const { startListening, stopListening, transcript } = useVoiceToText();
	const { setPrompt, setChoices, setHelpText, setVoice } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData, isRecording } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const helpText = useHelpText()

	// This function is called when the user submits the form or presses the send button.
	const handleSpeechToTextSubmit: FormEventHandler<HTMLFormElement> = async e => {

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

    // This is the UI of the whole green square chat box (ito ung kasama ung choices at chat box)
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