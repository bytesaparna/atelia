import { defineChain } from '@reown/appkit/networks';

export const somniaChain = defineChain({
    id: 50312,
    caipNetworkId: 'eip155:50312',
    chainNamespace: 'eip155',
    name: 'Somnia Testnet',
    nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://dream-rpc.somnia.network'] },
        public: { http: ['https://dream-rpc.somnia.network'] },
    },
    blockExplorers: {
        default: { name: 'Somnia explorer', url: 'https://shannon-explorer.somnia.network/' },
    },
    'assets': {
        imageId: 'https://shannon-explorer.somnia.network/assets/favicon/favicon-32x32.png',
        imageUrl: 'https://shannon-explorer.somnia.network/assets/favicon/favicon-32x32.png',
    }
})