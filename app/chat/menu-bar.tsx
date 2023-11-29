'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useHeaderMenu } from '@/lib/user-header-menu'
import {
	SpeakerX,
	ClockCounterClockwise,
	ArrowCounterClockwise,
} from '@phosphor-icons/react/dist/ssr/index'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { MobileMenuBar } from './mobile-menu-bar'
import wretch from 'wretch'
import { useMemo } from 'react'

type MenuBarProps = {
	src?: string | null
}

function renewSessionAndReload() {
	wretch('/api/session')
		.post()
		.json()
		.then(() => window.location.reload())
}

export function MenuBar({ src }: MenuBarProps) {
	const headerMenu = useHeaderMenu()

	const menuButtons = useMemo(
		() => (
			<>
				<button>
					<SpeakerX className="icon" />
				</button>
				<button>
					<ClockCounterClockwise className="icon" />
				</button>
				<button title="Restart session">
					<ArrowCounterClockwise
						className="icon"
						onClick={renewSessionAndReload}
					/>
				</button>
			</>
		),
		[]
	)

	if (!headerMenu) return <></>

	return createPortal(
		<>
			<MobileMenuBar className="lg:hidden" src={src}>
				{menuButtons}
			</MobileMenuBar>
			<menu className="flex h-14 gap-x-6 max-lg:hidden max-md:flex-col [&_*]:aspect-square">
				{menuButtons}
				<Popover>
					<PopoverTrigger>
						<Avatar className="cursor-pointer transition-transform hover:scale-105 active:scale-100">
							<AvatarImage src={src ?? undefined} />
							<AvatarFallback>Profile Picture</AvatarFallback>
						</Avatar>
					</PopoverTrigger>
					<PopoverContent hideWhenDetached>
						<button
							className="btn btn-primary w-full"
							onClick={() => signOut({ callbackUrl: '/' })}
						>
							Logout
						</button>
					</PopoverContent>
				</Popover>
			</menu>
		</>,
		headerMenu
	)
}
