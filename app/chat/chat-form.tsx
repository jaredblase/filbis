'use client'

import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr/index'
import { redirect } from 'next/navigation'
import { FormEventHandler, useEffect } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'

type ChatFormProps = {
	choices: Array<Choice>
}

export function ChatForm({ choices }: ChatFormProps) {
	const { setPrompt, setChoices } = useChatActions()
	const storedChoices = useChoices()

	useEffect(() => setChoices(choices), [])

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault()

		const { submitter } = e.nativeEvent as SubmitEvent
		let payload: string

		if (submitter && 'value' in submitter && submitter.value) {
			payload = submitter.value as string
		} else {
			const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
			payload = data.input.toString()
		}

		if (!payload) return console.error('payload cannot be empty!')

		const res = await wretch('/api/chat')
			.post({ text: payload })
			.badRequest((res) => console.error(res.cause))
			.unauthorized(() => redirect('/'))
			.internalError(res => console.error(res.cause))
			.json<ReturnType<typeof extractPromptAndChoices>>()

		setPrompt(res.prompt ?? '')
		setChoices(res.choices)
		console.log(JSON.stringify(res, null, 2))
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col gap-y-3 text-xl mb-4">
				{storedChoices.map(choice =>
					<button key={choice.payload} className="btn btn-primary w-full" value={choice.payload}>{choice.title}</button>
				)}
			</div>
			<div className="flex w-full items-center gap-x-2">
				<div className="relative flex-1">
					<input
						type="text"
						className="w-full rounded-full bg-white/50"
						placeholder="Type anything here!"
						name="input"
					/>
				</div>
				<button className="w-10 py-1">
					<PaperPlaneRight className="icon" />
				</button>
			</div>
		</form>
	)
}