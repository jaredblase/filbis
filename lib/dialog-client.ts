//Imports the Google Cloud Some API library (https://googleapis.dev/nodejs/dialogflow-cx/latest/index.html)
import { SessionsClient } from '@google-cloud/dialogflow-cx'
import { structProtoToJson } from './dialog-struct-parser'
import { google } from '@google-cloud/dialogflow-cx/build/protos/protos'
import { logger } from './logger'

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
	const sessionPath = dialogClient.projectLocationAgentSessionPath(
		process.env.CX_PROJECT_ID,
		'global',
		process.env.CX_BOT_ID,
		sessionKey
	)

	logger.debug('CLIENT REQUEST CONTENT: ' + text)

	const response = await dialogClient.detectIntent({
		session: sessionPath,
		queryInput: {
			languageCode,
			text: {
				text,
			},
		},
	})

	const res = response[0]

	logger.debug(
		'--- DIALOG RESPONSE ---\n' +
			JSON.stringify(res.queryResult?.responseMessages, null, 2)
	)

	return res
}

export function extractPromptAndChoices(
	res: google.cloud.dialogflow.cx.v3.IDetectIntentResponse
) {
	let prompt: string | undefined
	let voice: string | undefined
	let choices: Array<Choice> = []

	const message = res.queryResult?.responseMessages?.[0]

	if (message?.text) {
		prompt = message.text.text?.[0]
	} else if (message?.payload) {
		const data = structProtoToJson(message.payload)

		prompt = data.text
		voice = data.voice
		choices =
			data.quick_replies?.map((q: any) => ({
				title: q.title,
				payload: q.payload,
			})) ?? []
	}

	return {
		prompt,
		voice,
		choices,
	}
}
