'use client'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	SpeakerX,
	ClockCounterClockwise,
	Info,
	GearSix,
	SignOut,
} from '@phosphor-icons/react/dist/ssr/index'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PopoverTriggerProps } from '@radix-ui/react-popover'
import { signOut } from 'next-auth/react'

type MobileMenuBarProps = {
	src?: string | null
} & PopoverTriggerProps

export function MobileMenuBar({ src, children, ...props }: MobileMenuBarProps) {
	return (
		<Popover>
			<PopoverTrigger {...props}>
				<Avatar className="w-16 cursor-pointer transition-transform hover:scale-110 active:scale-100 border-2 border-white">
					<AvatarImage src={src ?? undefined} />
					<AvatarFallback>Profile Picture</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent
				className="bg-[#e26b3f] hover:bg-[#cf4412] w-16 rounded-full border-2 px-3 shadow-xl"
				hideWhenDetached
			>
				<menu className="grid gap-y-2 [&_*]:aspect-square ">
					{children}
					<button onClick={() => signOut({ callbackUrl: '/' })}>
						<SignOut className="icon hover:bg-[#e26b3f] rounded-lg" />
					</button>
				</menu>
			</PopoverContent>
		</Popover>
	)
}
