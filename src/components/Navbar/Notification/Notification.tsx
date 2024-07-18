'use client'

import { BellOutlined, LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Badge, Divider, Flex, List, Popover, Typography } from 'antd'
import { MessagePayload, onMessage } from 'firebase/messaging'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useFirebaseContext } from '@/context/useFirebaseContext'

import { NotificationItem, NotificationResponse, listNotifications } from '@/services/api/notifications'

import { createNotificationFromFCMMessagePayload } from './helpers'

export const Notification = () => {
	const router = useRouter()

	const { messaging } = useFirebaseContext()

	const [unreadMessageCount, setUnreadMessageCount] = useState(0)
	const [messages, setMessages] = useState<NotificationItem[]>([])

	const listNotificationsQuery = useQuery({
		queryKey: ['list-notifications'],
		queryFn: async () => {
			try {
				const response = await listNotifications()

				setMessages(response.notifications)
				setUnreadMessageCount(response.unreadCount)

				return response
			} catch (error) {
				console.error('Error', error)
			}
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		if (messaging == null) {
			return
		}

		const unsubscribe = onMessage(messaging, (payload) => {
			const notification = createNotificationFromFCMMessagePayload(payload)

			setUnreadMessageCount((prev) => prev + 1)
			setMessages((prev) => [notification, ...prev])
		})

		return () => {
			unsubscribe()
		}
	}, [messaging])

	return (
		<Badge count={unreadMessageCount}>
			<Popover
				arrow={false}
				trigger={['click']}
				placement="bottomRight"
				content={
					<Flex vertical gap={16}>
						<Typography.Title
							level={3}
							style={{
								marginBottom: 0,
							}}
						>
							Notifications
						</Typography.Title>

						<div
							style={{
								height: 1,
								background: '#f0f0f0',
							}}
						/>

						{listNotificationsQuery.isLoading ? (
							<LoadingOutlined />
						) : (
							<List
								itemLayout="horizontal"
								dataSource={messages}
								style={{
									minWidth: 400,
								}}
								renderItem={(item) => {
									return (
										<List.Item
											style={{
												background: item.status === 'unread' ? '#f0f7ff' : 'white',
												cursor: 'pointer',
											}}
											extra={
												<div
													style={{
														width: 8,
														height: 8,
														borderRadius: '50%',
														background: item.status === 'unread' ? '#1890ff' : 'transparent',
													}}
												/>
											}
											onClick={() => {
												setMessages((prev) =>
													prev.map((record) => {
														if (record.id === item.id) {
															return {
																...record,
																status: 'read',
															}
														}

														return record
													}),
												)

												if (item.link == null) {
													return
												}

												router.push(item.link)
											}}
										>
											<List.Item.Meta
												avatar={item.imageURL == null ? null : <Avatar src={item.imageURL} />}
												title={item.title}
												description={item.description}
											/>
										</List.Item>
									)
								}}
							/>
						)}
					</Flex>
				}
				onOpenChange={() => setUnreadMessageCount(0)}
			>
				<BellOutlined
					style={{
						fontSize: 24,
						color: 'white',
					}}
				/>
			</Popover>
		</Badge>
	)
}
