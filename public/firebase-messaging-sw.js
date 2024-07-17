importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js')

const firebaseConfig = {
	apiKey: 'AIzaSyBaw__5XKVNy1C0U2HVUgDEbete0gRQGjs',
	authDomain: 'poc-fcm-2bb17.firebaseapp.com',
	projectId: 'poc-fcm-2bb17',
	storageBucket: 'poc-fcm-2bb17.appspot.com',
	messagingSenderId: '913839611916',
	appId: '1:913839611916:web:5c21377622fd2f2469ce29',
	measurementId: 'BMRemlymv_nUuDfjaw282mVs25SSr3Srr8xiQaoI35brGYOXS6cbVwk2ag0pCPXub00dMNh6s3Zqay8oycg3Aws',
}

firebase.initializeApp(firebaseConfig)

let messaging

try {
	console.log('firebase.messaging.isSupported()', firebase.messaging.isSupported())

	messaging = firebase.messaging.isSupported() ? firebase.messaging() : null
} catch (err) {
	console.error('Failed to initialize Firebase Messaging', err)
}

messaging.onBackgroundMessage(async (payload) => {
	console.log('[firebase-messaging-sw.js] Received background message ', payload)

	const { link } = payload.data

	const notificationTitle = payload.notification.title

	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.image,
		data: {
			link,
		},
	}

	self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
	console.log('[firebase-messaging-sw.js] notificationclick event', event)

	event.notification.close()

	event.waitUntil(
		clients
			.matchAll({
				type: 'window',
				includeUncontrolled: true,
			})
			.then((windowClients) => {
				const url = event.notification.data.link

				if (url == null) {
					return
				}

				for (const client of windowClients) {
					if (client.url === url && 'focus' in client) {
						return client.focus()
					}
				}

				if (clients.openWindow) {
					return clients.openWindow(url)
				}
			}),
	)
})
