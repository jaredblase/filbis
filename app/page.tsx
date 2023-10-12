import { FilbisAvatar } from '@/components/Filbis'
import { HomeMenu } from './home-menu'

export default function HomePage() {
	return (
		<>
			<div className="absolute top-0 h-screen -z-10 w-full">
				<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1280 832" className="w-full h-full">
					<path d="M0 0H1280V59L0 384V0Z" fill="#215386" />
					<path d="M0 832H392L0 384V832Z" fill="#306CA8" />
				</svg>
			</div>
			<HomeMenu />
			<section className="text-secondary-100">
				<div className="bg-primary-400 px-10 py-5 mx-auto w-fit rounded-3xl mb-6">
					<p className="text-center font-shrikhand text-3xl">Welcome back!</p>
				</div>
				<h1 className="text-center h1 with-shadow">So, how are you?</h1>
				<FilbisAvatar className="m-auto center w-[75%] max-w-lg" />
			</section>
		</>
	)
}
