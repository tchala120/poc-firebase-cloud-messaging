import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const messaging = async () => {
	const supported = await isSupported()

	console.log('Is browser supported', supported)

	return supported ? getMessaging(app) : null
}

export const auth = getAuth(app)

export const getFCMToken = async () => {
	try {
		const fcmMessaging = await messaging()

		if (fcmMessaging == null) {
			throw Error('Firebase Cloud Messaging is not supported')
		}

		const permission = await Notification.requestPermission()

		if (permission === 'granted') {
			const token = await getToken(fcmMessaging, {
				vapidKey: process.env.NEXT_PUBLIC_FIREBASE_CLOUD_MESSAGE_PUBLIC_KEY,
			})

			return {
				token,
				messaging: fcmMessaging,
			}
		}
	} catch (error) {
		console.log('Error from messaging', error)
	}
}
