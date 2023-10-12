import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr/index'
import { FilbisAvatar } from '@/components/Filbis'
import { MenuBar } from './menu-bar'

export default function ChatPage() {
	return (
		<>
			<div className="absolute top-0 w-full max-h-96 -z-10">
				<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1280 287" className="w-full max-h-[inherit]">
					<path d="M-1 45.5V-0.5L1280.5 0V176L-1 45.5Z" fill="#215386" />
					<path d="M523 -1L0 287V-1H523Z" fill="#306CA8" />
				</svg>
			</div>
			<MenuBar />
			<section>
				<div className="container grid lg:grid-cols-2 gap-x-16 w-full">
					<div>
						<p className="text-center mb-4 h1 with-shadow">What language?</p>
						<FilbisAvatar className="mx-auto max-w-md w-full center" />
					</div>
					<div className="rounded-3xl grid place-items-center">
						<div className="grid gap-y-12 w-full max-w-md">
							<p className="font-medium text-center text-xl text-secondary-100">Click anything or type in the chatbox.</p>
							<div className="flex flex-col gap-y-3 text-xl">
								<button className="btn btn-primary w-full">English</button>
								<button className="btn btn-primary w-full">Filipino</button>
								<button className="btn btn-primary w-full">Bisaya</button>
							</div>
							<form className="flex items-center w-full gap-x-2">
								<div className="relative flex-1">
									<input type="text" className="w-full rounded-full bg-white/50" placeholder="Type anything here!" />
								</div>
								<button className="py-1 w-10">
									<PaperPlaneRight className="icon" />
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
