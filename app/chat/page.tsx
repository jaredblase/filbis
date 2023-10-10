import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr/index'
import { FilbisAvatar } from '@/components/Filbis'

export default function ChatPage() {
	return (
		<section className="min-h-screen grid place-items-center">
			<div className="container grid tabletL:grid-cols-2 gap-x-8">
				<div>
					<p className="font-shrikhand text-7xl text-beige-100 text-center mb-4">What language?</p>
					<FilbisAvatar className='' />
				</div>

				<div className="rounded-3xl bg-white/40 grid place-items-center">
					<div className="grid gap-y-8 w-full max-w-md">
						<p className="font-medium text-center text-xl">Click anything or type in the chatbox.</p>
						<div className="flex flex-col gap-y-3 text-xl">
							<button className="btn btn-primary w-full">English</button>
							<button className="btn btn-primary w-full">Filipino</button>
							<button className="btn btn-primary w-full">Bisaya</button>
						</div>
						<div className="flex items-center w-full gap-x-2">
							<div className="relative flex-1">
								<input type="text" className="w-full rounded-full bg-white/50" placeholder="Type anything here!" />
							</div>
							<button className="py-1 w-10">
								<PaperPlaneRight className="fill-white" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
