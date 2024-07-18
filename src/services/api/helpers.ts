import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()

export const getToken = (): Promise<string | undefined> =>
	new Promise((resolve, reject) => {
		onAuthStateChanged(
			auth,
			async (user) => {
				const token = user?.getIdToken()

				return resolve(token)
			},
			(error) => {
				return reject(error)
			},
		)
	})
