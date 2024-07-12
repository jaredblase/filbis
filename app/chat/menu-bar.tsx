'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useHeaderMenu } from '@/lib/user-header-menu'
import {
	IconContext,
	SpeakerX,
	SpeakerHigh,
	ArrowCounterClockwise,
	ChatCircleSlash,
	ChatCircle,
	SignOut,
} from '@phosphor-icons/react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { MobileMenuBar } from './mobile-menu-bar'
import wretch from 'wretch'
import { useMemo } from 'react'
import { useChatActions, useIsMuted, useIsVoiceMuted } from './store'

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
	const { toggleMute, toggleVoiceMute } = useChatActions()
	const isMuted = useIsMuted()
	const isVoiceMuted = useIsVoiceMuted()

	const menuButtons = useMemo(
		() => (
			<>
				<IconContext.Provider value={{ size: 36 }} >
					<button title="Toggle mute">
						{isMuted ? (
							<SpeakerX className="icon" onClick={toggleMute} />
						) : (
							<SpeakerHigh className="icon" onClick={toggleMute} />
						)}
					</button>

					<button title="Toggle microphone">
						{isVoiceMuted ? (
							<ChatCircleSlash className="icon" onClick={toggleVoiceMute} />
						) : (
							<ChatCircle className="icon" onClick={toggleVoiceMute} />
						)}
					</button>

					<button title="Restart session">
						<ArrowCounterClockwise
							className="icon"
							onClick={renewSessionAndReload}
						/>
					</button>
				</IconContext.Provider>
			</>
		),
		[isVoiceMuted, isMuted]
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
						<IconContext.Provider value={{ size: 36 }} >
							<button
								//className = "bg-[#e26b3f] hover:bg-[#cf4412] text-white py-2 px-4 border-b-4 border-white hover:border-white rounded-full btn w-[10vw]"
								//className="btn btn-primary w-full"
							>
								<SignOut className="icon" onClick={() => signOut({ callbackUrl: '/' })} />
							</button>
						</IconContext.Provider>
					</PopoverContent>
				</Popover>
			</menu>
		</>,
		headerMenu
	)
}
