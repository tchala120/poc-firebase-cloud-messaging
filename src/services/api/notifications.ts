import { type APIGetResponse, axios } from './base'

export interface NotificationItem {
	id: string
	title: string
	description: string
	imageURL?: string
	link?: string
	to?: string
	status: 'unread' | 'read'
}

export interface NotificationResponse {
	unreadCount: number
	notifications: NotificationItem[]
}

export const listNotifications = async () => {
	try {
		const response = await axios.get<APIGetResponse<NotificationResponse>>('/api/get-notification')

		return response.data.data
	} catch (error) {
		return Promise.reject(error)
	}
}
