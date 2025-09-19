import { ethers } from "ethers"
import { AuctionContract__factory, Cw20Contract__factory, Cw721Contract__factory, ExchangeContract__factory, KernelContract__factory, VfsContract__factory } from "../contract-types";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

export const RPC_PROVIDER = new ethers.JsonRpcProvider(RPC_URL);

export const KERNEL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KERNEL_ADDRESS;
export const KERNEL_CONTRACT = KernelContract__factory.connect(KERNEL_CONTRACT_ADDRESS, RPC_PROVIDER)

export const VFS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VFS_ADDRESS;
export const VFS_CONTRACT = VfsContract__factory.connect(VFS_CONTRACT_ADDRESS, RPC_PROVIDER)


export const getTokensContract = async (path: string) => {
    const token_address = await VFS_CONTRACT.resolve_path(path)
    return Cw721Contract__factory.connect(token_address, RPC_PROVIDER)
}

export const getSharesContract = async (path: string) => {
    const share_address = await VFS_CONTRACT.resolve_path(path)
    return Cw20Contract__factory.connect(share_address, RPC_PROVIDER)
}

export const getAuctionContract = async (path: string) => {
    const auction_address = await VFS_CONTRACT.resolve_path(path)
    return AuctionContract__factory.connect(auction_address, RPC_PROVIDER)
}

export const getExchangeContract = async (path: string) => {
    const exchange_address = await VFS_CONTRACT.resolve_path(path)
    return ExchangeContract__factory.connect(exchange_address, RPC_PROVIDER)
}