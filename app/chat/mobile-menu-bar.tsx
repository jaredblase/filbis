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
	DotsThreeOutlineVertical,
	SignOut,
} from '@phosphor-icons/react/dist/ssr/index'
import { PopoverTriggerProps } from '@radix-ui/react-popover'
import { signOut } from 'next-auth/react'

export function MobileMenuBar(props: PopoverTriggerProps) {
	return (
		<Popover>
			<PopoverTrigger {...props}>
				<DotsThreeOutlineVertical size={32} className="icon" />
			</PopoverTrigger>
			<PopoverContent
				className="w-16 rounded-full border-none bg-primary-400 px-3 shadow-lg"
				hideWhenDetached
			>
				<menu className="grid gap-y-2 [&_*]:aspect-square">
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
					<button onClick={() => signOut({ callbackUrl: '/' })}>
						<SignOut className="icon" />
					</button>
				</menu>
			</PopoverContent>
		</Popover>
	)
}
