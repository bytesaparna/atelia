'use client'
import { wagmiAdapter, projectId, networks } from '@/src/config'
import { somniaTestnet } from '@reown/appkit/networks';
import { createAppKit } from "@reown/appkit/react";
import { FC } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
    name: 'appkit-example',
    description: 'AppKit Example',
    url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const appKit = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: networks,
    metadata: metadata,
    features: {
        analytics: false,
        swaps: false,
    },
    chainImages: {
        [somniaTestnet.id]: 'https://shannon-explorer.somnia.network/assets/favicon/favicon-32x32.png',
    }
})


interface AppKitProviderProps {
    children: React.ReactNode
    cookies: string | null
}

const AppKitProvider: FC<AppKitProviderProps> = ({ children, cookies }) => {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            {children}
        </WagmiProvider>
    )
}

export default AppKitProvider