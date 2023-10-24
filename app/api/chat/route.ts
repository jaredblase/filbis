import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth/[...nextauth]/auth'
import { logger } from '@/lib/logger'
import { detectIntent, extractPromptAndChoices } from '@/lib/dialog-client'

type body = {
	text: string
}

export async function POST(req: NextRequest) {
	const [session, body] = await Promise.all([
		auth(),
		req.json() as Promise<body>,
	])

	if (!session?.user?.email) {
		return NextResponse.json('You are not logged in!', { status: 401 })
	}

	if (!body.text) {
		return NextResponse.json('Message cannot be empty!', { status: 400 })
	}

	// client for intent matching & getting responses
	try {
		const res = await detectIntent(session.user.email, body.text)
		logger.debug(
			'--- DIALOG RESPONSE ---\n' +
				JSON.stringify(res.queryResult?.responseMessages, null, 2)
		)

		const data = extractPromptAndChoices(res)

		if (!data.prompt) {
			throw Error(
				`[${session.user.email}] Empty prompt for payload: ${body.text}`
			)
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
