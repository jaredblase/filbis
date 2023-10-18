'use client'

import { HTMLAttributes, useEffect } from 'react'
import { useChatActions, usePrompt } from './store'

type PromptMessageProps = {
	prompt: string
} & HTMLAttributes<HTMLParagraphElement>

export function PromptMessage({ prompt, ...props }: PromptMessageProps) {
	const storedPrompt = usePrompt()
	const { setPrompt } = useChatActions()

	useEffect(() => setPrompt(prompt), [])

	return <p {...props}>{storedPrompt}</p>
}
