'use client'

import type { ReactNode } from 'react'

import { FirebaseProvider } from '@/context/useFirebaseContext'

import { ReactQueryClientProvider } from '@/setup/react-query'

interface ProvidersProps {
	children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	return (
		<ReactQueryClientProvider>
			<FirebaseProvider>{children}</FirebaseProvider>
		</ReactQueryClientProvider>
	)
}

export default Providers
