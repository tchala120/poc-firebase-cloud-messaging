import { useMutation } from '@tanstack/react-query'

import { useFirebaseContext } from '@/context/useFirebaseContext'

export const SendTestNotificationButton = () => {
	const { fcmToken } = useFirebaseContext()

	const sendTestNotificationMutation = useMutation({
		mutationFn: async (data: { token: string; title: string; body?: any }) => {
			const response = await fetch('/api/send-notification', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			return response.json()
		},
		onSuccess: (data) => {
			console.log('Success result', data)
		},
		onError: (data) => {
			console.log('Error result', data)
		},
	})

	return (
		<button
			disabled={sendTestNotificationMutation.isPending}
			className="px-4 py-2 border border-gray-300 rounded-md transition-all bg-white hover:bg-slate-100 disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500"
			onClick={() => {
				if (fcmToken == null) {
					return
				}

				sendTestNotificationMutation.mutate({
					token: fcmToken,
					title: 'This is a test notification',
					body: {
						product: 'iPhone',
						price: '1000',
						brand: 'apple',
						sentTime: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
					},
				})
			}}
		>
			Send Test Notification
		</button>
	)
}
