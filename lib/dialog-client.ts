import { SessionsClient } from '@google-cloud/dialogflow'
import { google } from '@google-cloud/dialogflow/build/protos/protos'
import { structProtoToJson } from './dialog-struct-parser'

export type Choice = {
	title: string
	payload: string
}

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

export function extractPromptAndChoices(
	res: google.cloud.dialogflow.v2.IDetectIntentResponse
) {
	let prompt: string | undefined
	let choices: Array<Choice> = []

	const message = res.queryResult?.fulfillmentMessages?.[0]

	if (message?.text) {
		prompt = message.text.text?.[0]
	} else if (message?.payload) {
		const data = structProtoToJson(message.payload)

		prompt = data.text
		choices = data.quick_replies.map((q: any) => ({
			title: q.title,
			payload: q.payload,
		}))
	}

	return {
		prompt,
		choices,
	}
}
