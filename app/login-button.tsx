'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/chat' })}
			className="btn btn-primary px-8 text-xl md:text-3xl mx-auto block"
		>
			Login
		</button>
	)
}
