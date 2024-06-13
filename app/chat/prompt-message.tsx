'use client'

import { HTMLAttributes, useEffect, useRef } from 'react'
import { useChatActions, useIsMuted, usePrompt, useVoice } from './store'
type PromptMessageProps = {
	prompt: string
	voice?: string
} & HTMLAttributes<HTMLParagraphElement>

export function PromptMessage({ prompt, voice, ...props }: PromptMessageProps) {
	const storedPrompt = usePrompt()
	const storedVoiceName = useVoice()
	const isMuted = useIsMuted()
	const { setPrompt, setVoice } = useChatActions()
	const player = useRef<HTMLAudioElement>(null)
	// const storedVoice = '/assets/audio_files/E146.mp3';

	useEffect(() => {
		setPrompt(prompt);
		setVoice(voice);
	  }, [prompt, voice]);

	useEffect(() => {
	if (storedVoiceName && !isMuted) {
		const fetchAudio = async () => {
		const extensions = ['.mp3', '.m4a', '.wav']; // List of possible extensions
		let audioSource = '';
		for (const ext of extensions) {
			try {
			const response = await fetch(`${storedVoiceName}${ext}`);
			if (response.ok) {
				audioSource = `${storedVoiceName}${ext}`;
				break;
			}
			} catch (error) {
			// console.error('Error fetching audio:', error);
			}
		}
		if (audioSource) {
			player.current?.setAttribute('src', audioSource);
			player.current?.load();
			player.current?.play().catch((error) => console.error('Error playing audio:', error));
		} else {
			// console.error('No audio source found');
		}
		};
		fetchAudio();
	}
	}, [storedVoiceName, isMuted]);
	
	useEffect(() => {
		if (player.current) player.current.volume = isMuted ? 0 : 1
	}, [isMuted])

	return (
		<>
			<p {...props}>{storedPrompt}</p>
			<audio ref={player}></audio>
		</>
	)
}
