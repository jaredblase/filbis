import { SessionsClient } from '@google-cloud/dialogflow'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth/[...nextauth]/auth'

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
	const client = new SessionsClient({
		credentials: {
			client_email: process.env.CX_CLIENT_EMAIL,
			private_key: process.env.CX_CLIENT_KEY.split(String.raw`\n`).join('\n'),
		},
	})

	const sessionPath = client.projectAgentSessionPath(
		process.env.CX_PROJECT_ID,
		session.user.email
	)

	const response = await client.detectIntent({
		session: sessionPath,
		queryInput: {
			text: {
				text: body.text, // USER UTTERANCE / TEXT / CHAT MESSAGE,
				languageCode: 'en',
			},
		},
	})

	console.log(response[0].queryResult?.fulfillmentMessages) // WHERE THE TEXT RESPONSE IS STORED
	NextResponse.json(response[0])
}
