import Image from 'next/image'
import dlsuLogo from '@/public/assets/dlsu-logo.svg'

export function Logos() {
	return (
		<div className="flex gap-x-6">
			<Image src={dlsuLogo} alt="DLSU Logo" className="w-28" priority />
			<p className="text-secondary-100 font-shrikhand h-28 w-auto container-block flex items-center">
				<span className="text-[46cqh]">Fil</span>
				<span className="block bg-secondary-100 aspect-square rounded-full p-[6cqh] ml-2">
					<span className="inline-flex items-center aspect-square p-[6cqh] bg-primary-400 rounded-full text-[46cqh]">
						bis
					</span>
				</span>
			</p>
		</div>
	)
}
