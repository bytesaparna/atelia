declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_PROJECT_ID: string;
        NEXT_PUBLIC_KERNEL_ADDRESS: string;
        NEXT_PUBLIC_ADODB_ADDRESS: string;
        NEXT_PUBLIC_VFS_ADDRESS: string;
        NEXT_PUBLIC_RPC_URL: string;
        NEXT_PUBLIC_OWNER_ADDRESS: string;
        WALLET_PRIVATE_KEY: string;
    }
}
