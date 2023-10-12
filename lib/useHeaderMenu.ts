import { useEffect, useState } from 'react'

export function useHeaderMenu() {
	const [headerMenu, setHeaderMenu] = useState<HTMLElement | null>(null)

	useEffect(() => {
		setHeaderMenu(document.getElementById('header-menu'))
	}, [])

	return headerMenu
}
