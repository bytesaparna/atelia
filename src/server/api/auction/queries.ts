import { getAuctionContract, RPC_PROVIDER } from "@/src/lib/evm-helper";
import { ethers, formatUnits } from "ethers";
import { unstable_cache } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { APP_CONFIG } from "@/src/config/app-config";


export const queryLatestAuctionState = (token_id: number, provider = RPC_PROVIDER) => unstable_cache(async () => {
    const state = await cachedLatestAuctionState(token_id, provider)();
    return {
        auction_address: state.auction_address,
        end_time: state.end_time,
        start_time: state.start_time,
        buy_now_price: state.buy_now_price,
        min_bid: state.min_bid,
        min_raise: state.min_raise,
        recipient: state.recipient,
        bid_asset: state.bid_asset,
        owner: state.owner
    }
}, ["auction", "latest_auction_state", "token_id", token_id.toString()], {
    revalidate: 60 * 60 * 24, // 24 hrs
})

export const queryLatestAuctionBidders = (token_id: number, provider = RPC_PROVIDER) => unstable_cache(async () => {
    const state = await cachedLatestAuctionState(token_id, provider)();
    return {
        high_bidder_amount: state.high_bidder_amount,
        high_bidder_address: state.high_bidder_address
    }
}, ["auction", "latest_auction_bidder", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})


const cachedLatestAuctionState = (token_id: number, provider = RPC_PROVIDER) => unstable_cache(async () => {
    const contract_address = await queryResolvePath(APP_CONFIG.auction_address())();
    const contract = await getAuctionContract(contract_address, provider);
    const state = await contract.read.latest_auction_state([BigInt(token_id)]);
    return {
        auction_address: contract_address,
        end_time: state.end_time.toString(),
        start_time: state.start_time.toString(),
        buy_now_price: Number(formatUnits(state.buy_now_price, "ether")),
        min_bid: Number(formatUnits(state.min_bid, "ether")),
        min_raise: Number(formatUnits(state.min_raise, "ether")),
        recipient: state.recipient,
        bid_asset: state.bid_asset,
        owner: state.owner,
        high_bidder_amount: Number(formatUnits(state.high_bidder_amount, "ether")),
        high_bidder_address: state.high_bidder_addr
    }
}, ["auction", "latest_auction_bidder", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})
