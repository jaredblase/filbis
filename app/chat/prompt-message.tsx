'use client'

import { HTMLAttributes, useEffect, useRef } from 'react'
import { useChatActions, useIsMuted, usePrompt, useVoice } from './store'

type PromptMessageProps = {
	prompt: string
	voice?: string
} & HTMLAttributes<HTMLParagraphElement>

export function PromptMessage({ prompt, voice, ...props }: PromptMessageProps) {
	const storedPrompt = usePrompt()
	const storedVoice = useVoice()
	const isMuted = useIsMuted()
	const { setPrompt, setVoice } = useChatActions()
	const player = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		setPrompt(prompt)
		setVoice(voice)
	}, [])

	useEffect(() => {
		if (storedVoice && !isMuted) player.current?.play().catch()
	}, [storedVoice])

	useEffect(() => {
		if (player.current) player.current.volume = isMuted ? 0 : 1
	}, [isMuted])

	return (
		<>
			<p {...props}>{storedPrompt}</p>
			<audio src={storedVoice} ref={player}></audio>
		</>
	)
}
