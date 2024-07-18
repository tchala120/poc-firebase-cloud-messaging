import admin from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/auth'
import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

if (!admin.apps.length) {
	const serviceAccount = require('@/secrets/firebase-admin-sdk.json')

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	})
}

const db = admin.firestore()

export async function GET(request: Request) {
	try {
		const authorizationToken = request.headers.get('Authorization')

		if (authorizationToken == null) {
			return NextResponse.json(
				{
					success: false,
					error: 'Unauthorized access',
				},
				{
					status: 401,
				},
			)
		}

		const decodedToken = jwtDecode<DecodedIdToken>(authorizationToken)

		const notificationRef = db.collection('/notifications')

		const listNotifications = await notificationRef.where('to', '==', decodedToken.email).get()

		if (listNotifications.empty) {
			return NextResponse.json(
				{
					status: 200,
					message: 'Successfully',
					data: [],
				},
				{
					status: 200,
				},
			)
		}

		const notifications = listNotifications.docs.map((doc) => {
			const data = doc.data()

			return {
				id: data.id,
				title: data.title,
				description: data.description,
				imageURL: data.imageURL,
				link: data.link,
				to: data.to,
				status: data.status,
			}
		})

		const unreadCount = notifications.filter((notification) => notification.status === 'unread').length

		return NextResponse.json(
			{
				status: 200,
				message: 'Successfully',
				data: {
					unreadCount,
					notifications,
				},
			},
			{
				status: 200,
			},
		)
	} catch (error) {
		console.log('Error getting list notifications: ', error)

		return NextResponse.json(error, {
			status: 500,
		})
	}
}
