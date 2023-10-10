import { FilbisAvatar } from '@/components/Filbis'

export default function HomePage() {
	return (
		<div className="text-beige-100">
			<div className="bg-orange-400 px-10 py-6 mx-auto w-fit rounded-[1.875em]">
				<p className="text-center font-shrikhand text-3xl">Welcome back!</p>
			</div>
			<h1 className="font-shrikhand text-center text-shadow text-shadow-y-4 shadow-orange-400">So, how are you?</h1>
			<FilbisAvatar className='m-auto' />
		</div>
	)
}