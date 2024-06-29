import Image from 'next/image'
import dlsuLogo from '@/public/assets/dlsu-logo.svg'
import dostSeal from '@/public/assets/dost-seal.svg'

export function Logos() {
	return (
		<div className="relative flex gap-x-2 md:gap-x-6 md:items-center sm:items-center xs:items-center">
			<Image src={dlsuLogo} alt="DLSU Logo" className="sm:w-[60px] xs:w-[40px]" priority />
			<Image src={dostSeal} alt="DOST Seal" className="sm:w-[60px] xs:w-[40px]" />
			<p className="container-block flex sm:h-[80px] xs:h-[40px] items-center font-shrikhand text-secondary-100">
				<span className="text-[46cqh]">Fil</span>
				<span className="ml-2 block aspect-square rounded-full bg-secondary-100 p-[6cqh]">
					<span className="inline-flex aspect-square items-center rounded-full bg-[#ED7042] p-[6cqh] text-[46cqh]">
						bis
					</span>
				</span>
			</p>
		</div>
	)
}
