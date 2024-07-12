// Reference: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query'
import { ReactNode } from 'react'

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient()
	}

	// Browser: make a new query client if we don't already have one
	// This is very important, so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	if (browserQueryClient == null) {
		browserQueryClient = makeQueryClient()
	}

	return browserQueryClient
}

interface ReactQueryClientProviderProps {
	children: ReactNode
}

export const ReactQueryClientProvider = ({ children }: ReactQueryClientProviderProps) => {
	const queryClient = getQueryClient()

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
