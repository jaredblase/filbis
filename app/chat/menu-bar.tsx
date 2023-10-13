'use client'

import { useHeaderMenu } from '@/lib/useHeaderMenu'
import {
	SpeakerX,
	ClockCounterClockwise,
	Info,
	GearSix,
} from '@phosphor-icons/react/dist/ssr/index'
import { createPortal } from 'react-dom'

export function MenuBar() {
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
		</menu>,
		headerMenu
	)
}
