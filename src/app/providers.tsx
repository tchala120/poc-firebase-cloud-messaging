'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import type { ReactNode } from 'react'

import { FirebaseProvider } from '@/context/useFirebaseContext'

import { ReactQueryClientProvider } from '@/setup/react-query'

interface ProvidersProps {
	children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	return (
		<AntdRegistry>
			<ConfigProvider
				componentSize="large"
				theme={{
					token: {
						fontFamily: 'inherit',
					},
				}}
			>
				<App>
					<ReactQueryClientProvider>
						<FirebaseProvider>{children}</FirebaseProvider>
					</ReactQueryClientProvider>
				</App>
			</ConfigProvider>
		</AntdRegistry>
	)
}

export default Providers
