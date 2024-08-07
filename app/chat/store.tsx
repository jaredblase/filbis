/*
	store.tsx
	> Ito ung file kung saan nakalagay lahat ng mga pinipili ng user sa UI.

*/

// LIBRARY IMPORTS

/*
	Library function from DialogflowCX
	- Choice: contains the 2 fields: title and payload (Used for DialogflowCX, too complicated to understand on how to use it)
		- Payload > Ito ung kung ano ung nilagay ng user sa chat bubble, ito ung gagamitin para malaman kung ano isasagot ngokth
		- Title > Ito ung gagamitin para idisplay ung pinili na button ng user sa button value.
*/
import { Choice } from '@/lib/dialog-client'

/*
	Function from a library (https://zustand-demo.pmnd.rs/)
	- create: used to create 
*/
import { create } from 'zustand'

type ChatStore = {
	prompt: string
	choices: Array<Choice>
	language: string
	helpText: string
	isMuted: boolean
	voice?: string
	isVoiceMuted: boolean
	actions: {
		setPrompt: (prompt: string) => void
		setChoices: (choices: Array<Choice>) => void
		setLanguage: (language: string) => void
		setHelpText: (helpText: string) => void
		setVoice: (voice?: string) => void
		toggleMute: () => void
		toggleVoiceMute: () => void
	}
}

const useChatStore = create<ChatStore>(set => ({
	prompt: 'Loading...',
	choices: [],
	language: "Type anything here!",
	helpText: 'Click anything or type in the chatbox.',
	isMuted: false,
	isVoiceMuted: true,
	voice: undefined,
	actions: {
		setPrompt: prompt => set({ prompt }),
		setChoices: choices => set({ choices }),
		setLanguage: language => set({language}),
		setHelpText: helpText => set({ helpText }),
		setVoice: voice => set({ voice: voice ? `/assets/audio_files/${voice}` : undefined }),
		toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
		toggleVoiceMute: () => set(state => ({ isVoiceMuted: !state.isVoiceMuted})),
	},
}))

export const usePrompt = () => useChatStore(state => state.prompt)
export const useVoice = () => useChatStore(state => state.voice)
export const useLanguage = () => useChatStore(state => state.language)
export const useChoices = () => useChatStore(state => state.choices)
export const useHelpText = () => useChatStore(state => state.helpText)
export const useIsMuted = () => useChatStore(state => state.isMuted)
export const useIsVoiceMuted = () => useChatStore(state => state.isVoiceMuted)
export const useChatActions = () => useChatStore(state => state.actions)
