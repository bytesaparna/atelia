import { BigNumberish, ethers } from "ethers"
import { AuctionContract__factory, Cw20Contract__factory, Cw721Contract__factory, ExchangeContract__factory, KernelContract__factory, Multicall3__factory, VfsContract__factory } from "../contract-types";
import { trpcClient } from "../trpc/clients";
import { cache } from "react";
import { createPublicClient, createWalletClient, getContract, http } from "viem"
import { somniaTestnet } from "viem/chains";


const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

// 1️⃣  Create a viem client that wraps multicall
export const RPC_PROVIDER = createPublicClient({
    chain: somniaTestnet,
    transport: http(RPC_URL),
    batch: {
        multicall: true  // <— this enables viem’s internal multicall3 batching
    }
})

export const getWalletSigner = async () => {
    const privateKey = process.env.WALLET_PRIVATE_KEY
    if (!privateKey) {
        throw new Error("Wallet Private Key is not set")
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    return new ethers.Wallet(privateKey, provider)
}


export const KERNEL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KERNEL_ADDRESS;
export const KERNEL_CONTRACT = getContract({
    address: KERNEL_CONTRACT_ADDRESS as `0x${string}`,
    abi: KernelContract__factory.abi,
    client: RPC_PROVIDER
})

export const VFS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VFS_ADDRESS;
export const VFS_CONTRACT = getContract({
    address: VFS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VfsContract__factory.abi,
    client: RPC_PROVIDER
})

export const getTokensContract = cache(async (path: string, provider = RPC_PROVIDER) => {
    let token_address = path;
    if (!path.startsWith("0x")) {
        token_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    const c = getContract({
        address: token_address as `0x${string}`,
        abi: Cw721Contract__factory.abi,
        client: provider

    })
    return c;
})


export const getSharesContract = cache(async (path: string, provider = RPC_PROVIDER) => {
    let share_address = path;
    if (!path.startsWith("0x")) {
        share_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return getContract({
        address: share_address as `0x${string}`,
        abi: Cw20Contract__factory.abi,
        client: provider
    })
})

export const getAuctionContract = cache(async (path: string, provider = RPC_PROVIDER) => {
    let auction_address = path;
    if (!path.startsWith("0x")) {
        auction_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return getContract({
        address: auction_address as `0x${string}`,
        abi: AuctionContract__factory.abi,
        client: provider
    })
})

export const getExchangeContract = cache(async (path: string, provider = RPC_PROVIDER) => {
    let exchange_address = path;
    if (!path.startsWith("0x")) {
        exchange_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    const c = getContract({
        address: exchange_address as `0x${string}`,
        abi: ExchangeContract__factory.abi,
        client: provider
    })
    return c;
})


export const getCurrentTimeInMilliseconds = () => {
    return Date.now()
}


type Cleaned<T> = {
    [K in keyof T as Exclude<K, keyof any[]>]:
    T[K] extends BigNumberish ? string : T[K]
};

/**
 * Converts a TypeChain tuple/struct into a plain object
 * keeping only the named fields and converting BigNumbers.
 */
export function toStructObject<T extends object>(tuple: T): Cleaned<T> {
    const out: any = {};
    for (const [key, value] of Object.entries(tuple)) {
        if (isNaN(Number(key))) {
            out[key] = typeof value === "bigint"
                ? value.toString()
                : value;
        }
    }
    return out;
}

