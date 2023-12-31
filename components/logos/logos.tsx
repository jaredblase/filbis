import Image from 'next/image'
import dlsuLogo from '@/public/assets/dlsu-logo.svg'
import dostSeal from '@/public/assets/dost-seal.svg'

export function Logos() {
	return (
		<div className="flex gap-x-2 md:gap-x-6">
			<Image src={dlsuLogo} alt="DLSU Logo" className="w-14 lg:w-28" priority />
			<Image src={dostSeal} alt="DOST Seal" className="w-14 lg:w-28" />
			<p className="container-block flex h-14 items-center font-shrikhand text-secondary-100 lg:h-28">
				<span className="text-[46cqh]">Fil</span>
				<span className="ml-2 block aspect-square rounded-full bg-secondary-100 p-[6cqh]">
					<span className="inline-flex aspect-square items-center rounded-full bg-primary-400 p-[6cqh] text-[46cqh]">
						bis
					</span>
				</span>
			</p>
		</div>
	)
}
