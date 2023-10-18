import { Choice } from '@/lib/dialog-client'
import { create } from 'zustand'

type ChatStore = {
	prompt: string
	choices: Array<Choice>
	actions: {
		setPrompt: (prompt: string) => void
		setChoices: (choices: Array<Choice>) => void
	}
}

const useChatStore = create<ChatStore>(set => ({
	prompt: 'Loading...',
	choices: [],
	actions: {
		setPrompt: prompt => set({ prompt }),
		setChoices: choices => set({ choices }),
	}
}))

export const usePrompt = () => useChatStore(state => state.prompt)
export const useChoices = () => useChatStore(state => state.choices)
export const useChatActions = () => useChatStore(state => state.actions)
