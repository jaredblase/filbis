import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function generateSessionId() {
	return crypto.randomBytes(18).toString('hex')
}
