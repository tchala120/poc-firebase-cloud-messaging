'use client'

import { MessagePayload, onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'

import { useFirebaseContext } from '@/context/useFirebaseContext'

const Message = () => {
	const [result, setResult] = useState<MessagePayload[]>([])

	const { fcmToken, messaging } = useFirebaseContext()

	useEffect(() => {
		if (messaging == null) {
			return
		}

		const unsubscribe = onMessage(messaging, (payload) => {
			console.log('Here is the payload from FCM', payload)

			setResult((prev) => [...prev, payload])
		})

		return () => {
			unsubscribe()
		}
	}, [messaging])

	return (
		<div className="flex flex-col gap-8 mx-auto min-w-[768px] max-w-full min-h-screen p-8">
			<h1 className="text-center text-2xl font-bold">Here is the message result</h1>

			<p>Current FCM token: {fcmToken}</p>

			{result.length === 0 ? null : <pre>{JSON.stringify(result, null, 2)}</pre>}
		</div>
	)
}

export default Message
