'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useHeaderMenu } from '@/lib/useHeaderMenu'
import {
	SpeakerX,
	ClockCounterClockwise,
	Info,
	GearSix,
} from '@phosphor-icons/react/dist/ssr/index'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'

type MenuBarProps = {
	src?: string | null
}

export function MenuBar({ src }: MenuBarProps) {
	const headerMenu = useHeaderMenu()

	if (!headerMenu) return <></>

	return createPortal(
		<menu className="flex h-14 gap-x-6 [&_*]:aspect-square">
			<button>
				<SpeakerX className="icon" />
			</button>
			<button>
				<ClockCounterClockwise className="icon" />
			</button>
			<button>
				<Info className="icon" />
			</button>
			<button>
				<GearSix className="icon" />
			</button>
			<Popover>
				<PopoverTrigger>
					<Avatar className="cursor-pointer transition-transform hover:scale-105 active:scale-100">
						<AvatarImage src={src ?? undefined} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</PopoverTrigger>
				<PopoverContent>
					<button
						className="btn btn-primary w-full"
						onClick={() => signOut({ callbackUrl: '/' })}
					>
						Logout
					</button>
				</PopoverContent>
			</Popover>
		</menu>,
		headerMenu
	)
}
