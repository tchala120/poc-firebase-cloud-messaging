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

export async function POST(request: Request) {
	try {
		const result = await request.json()

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

		const fcmTokensRef = db.collection('/fcm-tokens')

		const listUsers = await fcmTokensRef.where('email', '==', decodedToken.email).get()

		if (listUsers.empty) {
			await db.collection('/fcm-tokens').doc(decodedToken.user_id).set({
				id: decodedToken.user_id,
				email: decodedToken.email,
				token: result.token,
			})

			return NextResponse.json(
				{
					success: true,
					message: 'Token saved!',
					token: result.token,
				},
				{
					status: 200,
				},
			)
		}

		const user = listUsers.docs[0].data()

		await admin.firestore().collection('/fcm-tokens').doc(user.id).update({
			token: result.token,
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Token saved!',
				token: result.token,
			},
			{
				status: 200,
			},
		)
	} catch (error) {
		console.log('Error', error)

		return NextResponse.json(error, {
			status: 500,
		})
	}
}
