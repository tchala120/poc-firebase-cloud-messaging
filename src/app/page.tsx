'use client'

import { SendTestNotificationButton } from '@/components/SendTestNotificationButton'

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
			<h1>PoC Firebase Cloud Messaging</h1>

			<SendTestNotificationButton />
		</main>
	)
}
