import { SessionsClient } from '@google-cloud/dialogflow'

export const dialogClient = new SessionsClient({
	credentials: {
		client_email: process.env.CX_CLIENT_EMAIL,
		private_key: process.env.CX_CLIENT_KEY.split(String.raw`\n`).join('\n'),
	},
})

export async function detectIntent(
	sessionKey: string,
	text: string,
	languageCode = 'en'
) {
	const sessionPath = dialogClient.projectAgentSessionPath(
		process.env.CX_PROJECT_ID,
		sessionKey
	)

	const response = await dialogClient.detectIntent({
		session: sessionPath,
		queryInput: {
			text: {
				text,
				languageCode,
			},
		},
	})

	return response[0]
}
