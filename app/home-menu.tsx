'use client'

import { useHeaderMenu } from '@/lib/useHeaderMenu'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export function HomeMenu() {
	const headerMenu = useHeaderMenu()

	if (!headerMenu) return <></>

	return createPortal(
		<Link href="/chat" className="btn btn-primary text-xl px-8">Login</Link>,
		headerMenu
	)
}
