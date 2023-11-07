import { useRef, useState } from 'react'

export function useLoading(delayedMs = 500, timeoutMs = 8000) {
	const [submitting, setSubmitting] = useState(false)
	const [delayed, setDelayed] = useState(false)
	const [timedOut, setTimedOut] = useState(false)
	const delayedTimer = useRef<NodeJS.Timeout>()
	const timeoutTimer = useRef<NodeJS.Timeout>()

	function start() {
		setSubmitting(true)
		delayedTimer.current = setTimeout(() => setDelayed(true), delayedMs)
		timeoutTimer.current = setTimeout(() => setTimedOut(true)	, timeoutMs)
	}

	function stop() {
		setSubmitting(false)
		setDelayed(false)
		setTimedOut(false)
		clearTimeout(delayedTimer.current)
		clearTimeout(timeoutTimer.current)
	}

	return {
		submitting,
		delayed,
		timedOut,
		start,
		stop,
	}
}
