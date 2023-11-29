'use client'

import {
	PaperPlaneRight,
	Microphone,
} from '@phosphor-icons/react/dist/ssr/index'
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'
import FormDataAddon from 'wretch/addons/formData'

type ChatFormProps = {
	choices: Array<Choice>
}

export function ChatForm({ choices }: ChatFormProps) {
	const { setPrompt, setChoices, setHelpText } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData, isRecording } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const helpText = useHelpText()

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

		if (!Array.from(formData.keys()).length)
			return console.error('Payload cannot be empty!')

		loading.start()
		setHelpText('Loading...')

		const res = await wretch('/api/chat')
			.addon(FormDataAddon)
			.formData(Object.fromEntries(formData))
			.post()
			.badRequest(() => setHelpText('Invalid response. Please try again.'))
			.unauthorized(() => redirect('/'))
			.internalError(res => setHelpText(res.json))
			.json<ReturnType<typeof extractPromptAndChoices>>()

		if (res) {
			setPrompt(res.prompt ?? '')
			setChoices(res.choices)

			if (!res.prompt?.includes('again')) {
				form.current?.reset()
			}

			setHelpText('Click anything or type in the chatbox.')
		}

		loading.stop()
	}

	async function handleMicClick() {
		if (isRecording) {
			return stop().then(() => form.current?.requestSubmit())
		}

		start()
	}

	const handleChoiceClick: MouseEventHandler = e => {
		if (!input.current) return
		input.current.value = (e.target as HTMLButtonElement).value
		form.current?.requestSubmit()
	}

	return (
		<>
			<p className="text-center text-xl font-medium text-secondary-100">
				{helpText}
			</p>
			<form onSubmit={handleSubmit} ref={form}>
				<fieldset disabled={loading.submitting}>
					{loading.delayed ? (
						<Spinner className="mx-auto" />
					) : (
						<div className="mb-4 flex max-h-72 flex-col gap-y-3 overflow-y-auto px-2 text-xl scrollbar-thin">
							{storedChoices.map(choice => (
								<button
									key={choice.payload}
									type="button"
									className="btn btn-primary w-full"
									value={choice.payload}
									onClick={handleChoiceClick}
								>
									{choice.title}
								</button>
							))}
						</div>
					)}

					<div className="flex w-full items-center gap-x-2">
						<div className="relative flex-1">
							<input
								type="text"
								className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
								placeholder="Type anything here!"
								name="text"
								ref={input}
							/>
							<button
								className={`btn duration-[1.25s] absolute inset-y-0 right-2 my-auto aspect-square w-12 rounded-full p-1.5 transition-colors ${
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
				</fieldset>
			</form>
		</>
	)
}
