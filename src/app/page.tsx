'use client'

import { Button } from '@/components/Button'
import { SendTestNotificationButton } from '@/components/SendTestNotificationButton'

import { useFirebaseContext } from '@/context/useFirebaseContext'

export default function Home() {
	const { isLoggedIn, signIn, signOut } = useFirebaseContext()

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
			<h1>PoC Firebase Cloud Messaging</h1>

			{isLoggedIn ? (
				<>
					<SendTestNotificationButton />

					<Button onClick={() => signOut()}>Sign Out</Button>
				</>
			) : (
				<Button onClick={() => signIn()}>Sign In</Button>
			)}
		</main>
	)
}
