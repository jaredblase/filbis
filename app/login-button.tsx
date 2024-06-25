'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/chat' })}
			className="bg-[#e26b3f] hover:bg-[#cf4412] text-white px-[4vw] py-[1vh] border-b-4 border-white hover:border-white rounded-full btn lg:text-4xl md:text-4xl sm:text-2xl xs:text-3xl mx-auto block"
		>
			Login
		</button>
	)
}
