'use client'

import { UserOutlined } from '@ant-design/icons'
import { App, Button, Dropdown, MenuProps } from 'antd'

import { useFirebaseContext } from '@/context/useFirebaseContext'

import { Notification } from './Notification'

export const UserMenu = () => {
	const { message } = App.useApp()

	const { isLoggedIn, fcmToken, signIn, signOut } = useFirebaseContext()

	const items: MenuProps['items'] = [
		{
			key: 'fcm-token',
			label: 'Copy FCM Token',
			disabled: fcmToken == null,
			onClick: () => {
				if ('clipboard' in navigator && fcmToken != null) {
					navigator.clipboard.writeText(fcmToken).then(() => {
						message.success('FCM Token copied to clipboard')
					})
				}
			},
		},
		{
			key: 'sign-out',
			label: 'Sign Out',
			onClick: () => signOut(),
		},
	]

	if (isLoggedIn) {
		return (
			<div className="flex gap-8">
				<Notification />

				<Dropdown
					menu={{
						items,
					}}
					trigger={['click']}
				>
					<UserOutlined
						style={{
							fontSize: 24,
							color: 'white',
						}}
					/>
				</Dropdown>
			</div>
		)
	}

	return <Button onClick={signIn}>Sign In</Button>
}
