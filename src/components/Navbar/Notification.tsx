'use client'

import { BellOutlined } from '@ant-design/icons'
import { Badge } from 'antd'
import { onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'

import { useFirebaseContext } from '@/context/useFirebaseContext'

export const Notification = () => {
	const { messaging } = useFirebaseContext()

	const [unreadMessageCount, setUnreadMessageCount] = useState(0)

	useEffect(() => {
		if (messaging == null) {
			return
		}

		console.log('Triggred')

		const unsubscribe = onMessage(messaging, (payload) => {
			console.log('Here is the payload from FCM', payload)

			setUnreadMessageCount((prev) => prev + 1)
		})

		return () => {
			unsubscribe()
		}
	}, [messaging])

	return (
		<Badge count={unreadMessageCount}>
			<BellOutlined
				style={{
					fontSize: 24,
					color: 'white',
				}}
				onClick={() => {
					setUnreadMessageCount(0)
				}}
			/>
		</Badge>
	)
}
