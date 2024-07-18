import admin from 'firebase-admin'
import type { Message } from 'firebase-admin/messaging'
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

		const message: Message = {
			token: result.token,
			data: {
				link: result.link,
			},
			notification: {
				title: result.title,
				body: result.description,
				imageUrl: result.imageUrl,
			},
		}

		const messageResult = await admin.messaging().send(message)

		const listUsers = await db.collection('/fcm-tokens').where('token', '==', result.token).get()
		const user = listUsers.docs[0].data()

		await db.collection('/notifications').add({
			id: messageResult,
			title: result.title,
			description: result.description,
			imageURL: result.imageUrl,
			link: result.link,
			to: user.email,
			status: 'unread',
		})

		return NextResponse.json({
			success: true,
			message: 'Notification sent!',
			result: messageResult,
		})
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error,
			},
			{
				status: 500,
			},
		)
	}
}
