import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth/[...nextauth]/auth'
import { logger } from '@/lib/logger'
import { detectIntent, extractPromptAndChoices } from '@/lib/dialog-client'
import wretch from 'wretch'
import FormDataAddOn from 'wretch/addons/formData'
import fs from 'fs/promises'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
	const [session, body] = await Promise.all([auth(), req.formData()])

	if (!session?.user?.email) {
		return NextResponse.json('You are not logged in!', { status: 401 })
	}

	let text = ''

	if (body.has('text')) {
		text = body.get('text')!.toString()
	} else if (body.has('audio')) {
		const audio = body.get('audio') as Blob

		await fs.writeFile(
			'/tmp/test.wav',
			new Uint8Array(await audio.arrayBuffer())
		)

		const res = await wretch(process.env.ASR_API)
			.addon(FormDataAddOn)
			.formData({
				speaker: 'children',
				language: 'filipino',
				file: audio,
			})
			.post()
			.json<string>()
			.catch(err =>
				console.log('----Error from ASR Server----\n', err.response)
			)

		if (!res)
			return NextResponse.json(
				'Sorry, we could not get that. Please try again.',
				{ status: 500 }
			)

		text = res
	}

	if (!text)
		return NextResponse.json('Message cannot be empty!', { status: 400 })

	// client for intent matching & getting responses
	try {
		const res = await detectIntent(
			cookies().get('ss_id')?.value ?? session.user.email,
			text
		)
		const data = extractPromptAndChoices(res)

		if (!data.prompt) {
			throw Error(`[${session.user.email}] Empty prompt for payload: ${text}`)
		}

		return NextResponse.json(data)
	} catch (e) {
		logger.error(e)
		return NextResponse.json(
			'Filbis is not feeling well right now. Come back later!',
			{ status: 500 }
		)
	}
}
