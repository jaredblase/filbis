import { Choice } from '@/lib/dialog-client'
import { create } from 'zustand'

type ChatStore = {
	prompt: string
	choices: Array<Choice>
	helpText: string
	isMuted: boolean
	voice?: string
	actions: {
		setPrompt: (prompt: string) => void
		setChoices: (choices: Array<Choice>) => void
		setHelpText: (helpText: string) => void
		setVoice: (voice?: string) => void
		toggleMute: () => void
	}
}

const useChatStore = create<ChatStore>(set => ({
	prompt: 'Loading...',
	choices: [],
	helpText: 'Click anything or type in the chatbox.',
	isMuted: false,
	voice: undefined,
	actions: {
		setPrompt: prompt => set({ prompt }),
		setChoices: choices => set({ choices }),
		setHelpText: helpText => set({ helpText }),
		setVoice: voice => set({ voice: voice ? `/assets/audio_files/${voice}` : undefined }),
		toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
	},
}))

export const usePrompt = () => useChatStore(state => state.prompt)
export const useVoice = () => useChatStore(state => state.voice)
export const useChoices = () => useChatStore(state => state.choices)
export const useHelpText = () => useChatStore(state => state.helpText)
export const useIsMuted = () => useChatStore(state => state.isMuted)
export const useChatActions = () => useChatStore(state => state.actions)
