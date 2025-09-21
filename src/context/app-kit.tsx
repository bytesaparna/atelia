'use client'
import { wagmiAdapter, projectId, networks } from '@/src/config'
import { somniaTestnet } from '@reown/appkit/networks';
import { createAppKit } from "@reown/appkit/react";
import { FC, useLayoutEffect, useState } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { Loader } from '../components/loader';

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

interface AppKitProviderProps {
    children: React.ReactNode
    cookies: string | null
}

const AppKitProvider: FC<AppKitProviderProps> = ({ children, cookies }) => {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    const [isReady, setIsReady] = useState(false);

    useLayoutEffect(() => {
        createAppKit({
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
        }).ready().then(() => {
            setIsReady(true);
        })

    }, [])

    if (!isReady) {
        return (
            <div className='h-[100vh] flex items-center justify-center'>
                <div
                    className="max-w-xl w-full"
                >
                    <Loader text="ATELIA" automatic={true} />
                </div>
            </div>
        )
    }

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            {children}
        </WagmiProvider>
    )
}

export default AppKitProvider