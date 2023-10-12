'use client'

import { useHeaderMenu } from '@/lib/useHeaderMenu'
import { createPortal } from 'react-dom'
import { signIn } from 'next-auth/react'

export function HomeMenu() {
	const headerMenu = useHeaderMenu()

	if (!headerMenu) return <></>

	return createPortal(
		<button onClick={() => signIn('google', { callbackUrl: '/chat' })} className="btn btn-primary text-xl px-8">Login</button>,
		headerMenu
	)
}
