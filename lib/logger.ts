import fs, { mkdirSync } from 'fs'
import path from 'path'

const LOG_LEVELS = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6,
} as const

export type LogLevel = keyof typeof LOG_LEVELS

const THRESHOLD = LOG_LEVELS[process.env.LOG_LEVEL || 'info']

function log(level: LogLevel, data: any) {
	if (LOG_LEVELS[level] > THRESHOLD) return

	// file logs
	const filePath = path.join(process.cwd(), 'app.log')
	let message = `[${new Date().toISOString()}] `

	if (data instanceof Error && data.stack) {
		message += data.stack
	} else {
		message += data.toString()
	}

	message += '\n'

	fs.appendFileSync(filePath, message)

	// console logs
	if (level === 'error') {
		return console.error(data)
	}

	if (process.env.NODE_ENV !== 'production') {
		return console.log(data)
	}
}

export const logger = {
	error: (data: string | unknown) => log('error', data),
	warn: (data: string | unknown) => log('warn', data),
	info: (data: string | unknown) => log('info', data),
	http: (data: string | unknown) => log('http', data),
	verbose: (data: string | unknown) => log('verbose', data),
	debug: (data: string | unknown) => log('debug', data),
	silly: (data: string | unknown) => log('silly', data),
} satisfies Record<LogLevel, typeof log>
