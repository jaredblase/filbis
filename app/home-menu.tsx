'use client'
import { useHeaderMenu } from '@/lib/useHeaderMenu'
import { createPortal } from 'react-dom'


export function HomeMenu() {
	const headerMenu = useHeaderMenu()

	if (!headerMenu) return <></>

	return createPortal(
		<button className="btn btn-primary text-xl px-8">Login</button>,
		headerMenu
	)
}
