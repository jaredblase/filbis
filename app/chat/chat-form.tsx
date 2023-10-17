'use client'

import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr/index'
import wretch from 'wretch'

export function ChatForm() {
	async function handleClick() {
		await wretch('/api/chat').post({ text: 'hello', language: 'en' }).json()
	}
	return (
		<>
			<div className="flex flex-col gap-y-3 text-xl">
				<button className="btn btn-primary w-full" onClick={handleClick}>English</button>
				<button className="btn btn-primary w-full">Filipino</button>
				<button className="btn btn-primary w-full">Bisaya</button>
			</div>
			<form className="flex w-full items-center gap-x-2">
				<div className="relative flex-1">
					<input
						type="text"
						className="w-full rounded-full bg-white/50"
						placeholder="Type anything here!"
					/>
				</div>
				<button className="w-10 py-1">
					<PaperPlaneRight className="icon" />
				</button>
			</form>
		</>
	)
}