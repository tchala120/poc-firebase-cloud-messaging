import { MessagePayload } from 'firebase/messaging'

import { NotificationItem } from '@/services/api'

export const createNotificationFromFCMMessagePayload = (payload: MessagePayload): NotificationItem => {
	return {
		id: payload.messageId,
		title: payload.notification?.title || '',
		description: payload.notification?.body || '',
		imageURL: payload.notification?.image,
		link: payload.data?.link,
		status: 'unread',
	}
}
