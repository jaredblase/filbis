'use client'

import { SpeakerX, ClockCounterClockwise, Info, GearSix } from '@phosphor-icons/react/dist/ssr/index'


export function MenuBar() {
	return (
		<menu className="flex h-12 gap-x-4 [&_*]:aspect-square">
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
		</menu>
	)
}