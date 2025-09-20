import { BigNumberish, ethers } from "ethers"
import { AuctionContract__factory, Cw20Contract__factory, Cw721Contract__factory, ExchangeContract__factory, KernelContract__factory, VfsContract__factory } from "../contract-types";
import { trpcClient } from "../trpc/clients";


const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

export const RPC_PROVIDER = new ethers.JsonRpcProvider(RPC_URL);

export const KERNEL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KERNEL_ADDRESS;
export const KERNEL_CONTRACT = KernelContract__factory.connect(KERNEL_CONTRACT_ADDRESS, RPC_PROVIDER)

export const VFS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VFS_ADDRESS;
export const VFS_CONTRACT = VfsContract__factory.connect(VFS_CONTRACT_ADDRESS, RPC_PROVIDER)


export const getTokensContract = async (path: string, provider = RPC_PROVIDER) => {
    let token_address = path;
    if (!path.startsWith("0x")) {
        token_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return Cw721Contract__factory.connect(token_address, provider)
}

export const getSharesContract = async (path: string, provider = RPC_PROVIDER) => {
    let share_address = path;
    if (!path.startsWith("0x")) {
        share_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return Cw20Contract__factory.connect(share_address, provider)
}

export const getAuctionContract = async (path: string, provider = RPC_PROVIDER) => {
    let auction_address = path;
    if (!path.startsWith("0x")) {
        auction_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return AuctionContract__factory.connect(auction_address, provider)
}

export const getExchangeContract = async (path: string, provider = RPC_PROVIDER) => {
    let exchange_address = path;
    if (!path.startsWith("0x")) {
        exchange_address = await trpcClient.vfs.resolvePath.query({ path })
    }
    return ExchangeContract__factory.connect(exchange_address, provider)
}


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
