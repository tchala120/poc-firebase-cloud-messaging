importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

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

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Received background message ', payload)

	const notificationTitle = payload.notification.title
	const notificationOptions = {
		body: payload.notification.body,
	}
	self.registration.showNotification(notificationTitle, notificationOptions)
})
