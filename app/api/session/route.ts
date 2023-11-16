import { NextResponse } from 'next/server'
import { generateSessionId } from '@/lib/utils'
import { cookies } from 'next/headers'
import { auth } from '../auth/[...nextauth]/auth'

export async function POST() {
	const sessions = await auth()

	if (!sessions?.user)
		return NextResponse.json('You are not logged in!', { status: 401 })

	cookies().set('ss_id', generateSessionId(), { secure: true })
	return NextResponse.json({})
}
