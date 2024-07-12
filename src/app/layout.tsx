import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import './globals.css'
import Providers from './providers'

const notoSans = Noto_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
	title: 'PoC Firebase Cloud Messaging',
	description: 'Proof of concept for Firebase Cloud Messaging',
}

interface RootLayoutProps {
	children: ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<body className={notoSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
