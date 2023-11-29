import { Choice } from '@/lib/dialog-client'
import { create } from 'zustand'

type ChatStore = {
	prompt: string
	choices: Array<Choice>
	helpText: string
	actions: {
		setPrompt: (prompt: string) => void
		setChoices: (choices: Array<Choice>) => void
		setHelpText: (helpText: string) => void
	}
}

const useChatStore = create<ChatStore>(set => ({
	prompt: 'Loading...',
	choices: [],
	helpText: 'Click anything or type in the chatbox.',
	actions: {
		setPrompt: prompt => set({ prompt }),
		setChoices: choices => set({ choices }),
		setHelpText: helpText => set({ helpText }),
	},
}))

export const usePrompt = () => useChatStore(state => state.prompt)
export const useChoices = () => useChatStore(state => state.choices)
export const useHelpText = () => useChatStore(state => state.helpText)
export const useChatActions = () => useChatStore(state => state.actions)
