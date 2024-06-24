'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/chat' })}
			className="bg-blue-500 hover:bg-blue-400 text-white px-[4vw] py-[1vh] border-b-4 border-blue-700 hover:border-blue-500 rounded-full btn lg:text-4xl md:text-4xl sm:text-2xl xs:text-3xl mx-auto block"
		>
			Login
		</button>
	)
}
