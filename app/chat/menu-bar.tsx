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
	SpeakerHigh,
	ArrowCounterClockwise,
} from '@phosphor-icons/react/dist/ssr/index'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { MobileMenuBar } from './mobile-menu-bar'
import wretch from 'wretch'
import { useMemo } from 'react'
import { useChatActions, useIsMuted } from './store'

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
	const { toggleMute } = useChatActions()
	const isMuted = useIsMuted()

	const menuButtons = useMemo(
		() => (
			<>
				<button title="Toggle mute">
					{isMuted ? (
						<SpeakerX className="icon" onClick={toggleMute} />
					) : (
						<SpeakerHigh className="icon" onClick={toggleMute} />
					)}
				</button>
				<button title="Restart session">
					<ArrowCounterClockwise
						className="icon"
						onClick={renewSessionAndReload}
					/>
				</button>
			</>
		),
		[isMuted]
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
						<Avatar className="cursor-pointer transition-transform hover:scale-110 active:scale-100 border-2 border-white">
							<AvatarImage src={src ?? undefined} />
							<AvatarFallback>Profile Picture</AvatarFallback>
						</Avatar>
					</PopoverTrigger>
					<PopoverContent hideWhenDetached>
						<button
							className = "bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-full btn w-full"
							//className="btn btn-primary w-full"
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
