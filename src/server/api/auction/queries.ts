import { getAuctionContract, toStructObject } from "@/src/lib/evm-helper";
import { ethers } from "ethers";
import { unstable_cache } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { APP_CONFIG } from "@/src/config/app-config";


export const queryLatestAuctionState = (token_id: number, provider: ethers.JsonRpcProvider) => unstable_cache(async () => {
    const contract_address = await queryResolvePath(APP_CONFIG.auction_address())();
    const contract = await getAuctionContract(contract_address, provider);
    const state = await contract.latest_auction_state(token_id);
    return {
        auction_address: contract_address,
        high_bidder_amount: state.high_bidder_amount.toString(),
        end_time: state.end_time.toString(),
        start_time: state.start_time.toString(),
        buy_now_price: state.buy_now_price.toString(),
        min_bid: state.min_bid.toString(),
        min_raise: state.min_raise.toString(),
        recipient: state.recipient,
        bid_asset: state.bid_asset,
        owner: state.owner,
    }
}, ["auction", "latest_auction_state", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})