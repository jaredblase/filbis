'use client'

import { useRef, useState } from 'react'

export function useRecorder() {
	const recorder = useRef<MediaRecorder>()
	const chunks = useRef<Array<Blob>>([])
	const [isRecording, setIsRecording] = useState(false)

	async function createRecorder() {
		if (!navigator.mediaDevices?.getUserMedia)
			throw Error('No media device available!')

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		const recorder = new MediaRecorder(stream)

		recorder.ondataavailable = e => {
			chunks.current.push(e.data)
		}

		return recorder
	}

	async function start() {
		if (!recorder.current) {
			recorder.current = await createRecorder()
		}

		recorder.current.start()
		setIsRecording(true)
	}

	function stop() {
		recorder.current?.stop()
		setIsRecording(false)

		// resolve when recorder has finished processing data
		return new Promise<void>(resolve => {
			const int = setInterval(() => {
				if (chunks.current.length) {
					resolve()
					clearInterval(int)
				}
			}, 200)
		})
	}

	function clearData() {
		chunks.current = []
	}

	return {
		start,
		stop,
		clearData,
		getFile() {
			if (!chunks.current.length) return
			return new File(chunks.current, 'audio.wav', { type: 'audio/wav' })
		},
		isRecording,
	}
}
