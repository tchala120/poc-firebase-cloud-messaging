import admin from 'firebase-admin'
import type { MulticastMessage } from 'firebase-admin/messaging'
import { NextResponse } from 'next/server'

if (!admin.apps.length) {
	const serviceAccount = require('@/secrets/firebase-admin-sdk.json')

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	})
}

const db = admin.firestore()

export async function POST(request: Request) {
	try {
		const result = await request.json()

		const tokenResponse = await db.collection('/fcm-tokens').select('token').get()
		const listFCMTokens = tokenResponse.docs.map((item) => item.data().token)

		const uniqueTokens = Array.from(new Set(listFCMTokens))

		const multicastMessage: MulticastMessage = {
			tokens: uniqueTokens,
			data: {
				title: result.title,
				...result.body,
			},
		}

		const messageResult = await admin.messaging().sendEachForMulticast(multicastMessage)

		return NextResponse.json({
			success: true,
			message: 'Notification sent!',
			result: messageResult,
		})
	} catch (error) {
		console.log('Error', error)

		return NextResponse.json({
			success: false,
			error,
		})
	}
}
