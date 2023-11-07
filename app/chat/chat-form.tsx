'use client'

import {
	PaperPlaneRight,
	Microphone,
} from '@phosphor-icons/react/dist/ssr/index'
import { redirect } from 'next/navigation'
import { FormEventHandler, useEffect } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'

type ChatFormProps = {
	choices: Array<Choice>
}

export function ChatForm({ choices }: ChatFormProps) {
	const { setPrompt, setChoices } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, data, isRecording } = useRecorder()
	const loading = useLoading()

	useEffect(() => setChoices(choices), [])

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault()

		const { submitter } = e.nativeEvent as SubmitEvent
		const form = e.target as HTMLFormElement

		let payload: string

		if (submitter && 'value' in submitter && submitter.value) {
			payload = submitter.value as string
		} else {
			const data = Object.fromEntries(new FormData(form))
			payload = data.input.toString()
		}

		if (!payload) return console.error('payload cannot be empty!')

		loading.start()

		const res = await wretch('/api/chat')
			.post({ text: payload })
			.badRequest(res => console.error(res.cause))
			.unauthorized(() => redirect('/'))
			.internalError(res => console.error(res.cause))
			.json<ReturnType<typeof extractPromptAndChoices>>()

		setPrompt(res.prompt ?? '')
		setChoices(res.choices)

		if (!res.prompt?.includes('again')) {
			form.reset()
		}

		loading.stop()
	}

	async function handleMicClick() {
		if (isRecording) {
			return stop()
		}

		start()
	}

	return (
		<form onSubmit={handleSubmit}>
			{loading.delayed ? (
				<Spinner className="mx-auto" />
			) : (
				<div className="mb-4 flex flex-col gap-y-3 text-xl">
					{storedChoices.map(choice => (
						<button
							key={choice.payload}
							className="btn btn-primary w-full"
							value={choice.payload}
							disabled={loading.submitting}
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
						name="input"
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
				<button className="w-10 py-1">
					<PaperPlaneRight className="icon" />
				</button>
			</div>
		</form>
	)
}
