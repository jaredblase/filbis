'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/chat' })}
			className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-full btn px-8 text-xl md:text-3xl mx-auto block"
		>
			Login
		</button>
	)
}
