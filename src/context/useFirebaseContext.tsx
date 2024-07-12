'use client'

import { useQuery } from '@tanstack/react-query'
import { Messaging, getToken } from 'firebase/messaging'
import { ReactNode, createContext, useContext, useState } from 'react'

import { messaging } from '@/setup/firebase'

interface FirebaseContextData {
	messaging: Messaging
	fcmToken: string | null
}

const FirebaseContext = createContext<any>(null)

interface FirebaseProviderProps {
	children: ReactNode
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
	const [fcmMessaging, setFCMMessaging] = useState<Messaging | null>(null)

	const [fcmToken, setFCMToken] = useState<string | null>(null)

	useQuery({
		queryKey: ['initialize-firebase-cloud-messaging'],
		queryFn: async () => {
			try {
				const fcmMessaging = await messaging()

				if (fcmMessaging == null) {
					throw Error('Firebase Cloud Messaging is not supported')
				}

				setFCMMessaging(fcmMessaging)

				const permission = await Notification.requestPermission()

				if (permission === 'granted') {
					const result = await getToken(fcmMessaging, {
						vapidKey: process.env.NEXT_PUBLIC_FIREBASE_CLOUD_MESSAGE_PUBLIC_KEY,
					})

					setFCMToken(result)

					return result
				}

				return null
			} catch (error) {
				console.log('Error from messaging', error)

				return null
			}
		},
	})

	if (fcmMessaging == null) {
		return null
	}

	const value: FirebaseContextData = {
		messaging: fcmMessaging,
		fcmToken,
	}

	return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export const useFirebaseContext = () => useContext<FirebaseContextData>(FirebaseContext)
