import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { generateSessionId } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'

export const authConfig = {
	secret: process.env.SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	jwt: {
		maxAge: 60 * 30, // 30 minutes
	},
	callbacks: {
		signIn() {
			cookies().set('ss_id', generateSessionId(), { secure: true })
			return true
		},
	},
} satisfies NextAuthOptions

export function auth() {
	return getServerSession(authConfig)
}
