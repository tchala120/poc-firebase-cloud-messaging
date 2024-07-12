'use client'

import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { Messaging } from 'firebase/messaging'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { auth, getFCMToken } from '@/setup/firebase'

interface FirebaseContextData {
	messaging: Messaging | null
	fcmToken: string | null
	isLoggedIn: boolean
	user: User | null
	signIn: () => Promise<any>
	signOut: VoidFunction
}

const FirebaseContext = createContext<any>(null)

interface FirebaseProviderProps {
	children: ReactNode
}

const googleAuthProvider = new GoogleAuthProvider()
googleAuthProvider.setCustomParameters({
	prompt: 'select_account',
})

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
	const [loading, setLoading] = useState(true)
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null)

	const [fcmMessaging, setFCMMessaging] = useState<Messaging | null>(null)
	const [fcmToken, setFCMToken] = useState<string | null>(null)

	const sendTokenToServer = async () => {
		const response = await getFCMToken()

		if (response == null) {
			return
		}

		const userToken = await auth.currentUser?.getIdToken()

		if (userToken == null) {
			return
		}

		const result = await fetch('/api/fcm-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: userToken,
			},
			body: JSON.stringify({
				token: response.token,
			}),
		})

		setFCMMessaging(response.messaging)
		setFCMToken(response.token)

		return result
	}

	const signIn = async () =>
		new Promise((resolve, reject) => {
			signInWithPopup(auth, googleAuthProvider)
				.then((result) => {
					console.log('Result', result)

					const credential = GoogleAuthProvider.credentialFromResult(result)

					if (credential == null) {
						reject({
							code: 'credential-not-found',
							message: 'Credential not found',
						})

						return
					}

					const token = credential.accessToken

					const user = result.user

					sendTokenToServer().then((response) => {
						if (response == null) {
							return
						}

						return resolve({
							user,
							token,
						})
					})
				})
				.catch((error) => {
					const errorCode = error.code
					const errorMessage = error.message

					const email = error.customData.email

					const credential = GoogleAuthProvider.credentialFromError(error)

					reject({
						code: errorCode,
						message: errorMessage,
						data: {
							email,
							credential,
						},
					})
				})
				.finally(() => setLoading(false))
		})

	const signOut = async () => {
		try {
			await auth.signOut()

			setFirebaseUser(null)
		} catch (error) {
			console.log('Error signing out user', error)
		}
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user == null) {
				setLoading(false)

				return
			}

			sendTokenToServer()

			setFirebaseUser(user)

			setLoading(false)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<h1 className="m-0 text-center font-bold text-4xl">Loading...</h1>
			</div>
		)
	}

	const value: FirebaseContextData = {
		messaging: fcmMessaging,
		fcmToken,
		isLoggedIn: firebaseUser != null,
		user: firebaseUser,
		signIn,
		signOut,
	}

	return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export const useFirebaseContext = () => useContext<FirebaseContextData>(FirebaseContext)
