import { getExchangeContract } from "@/src/lib/evm-helper";
import { ethers, formatUnits } from "ethers";
import { unstable_cache } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { APP_CONFIG } from "@/src/config/app-config";


export const queryBuyExchangeConfig = (token_id: number, provider: ethers.JsonRpcProvider) => unstable_cache(async () => {
    const exchange_address = await queryResolvePath(APP_CONFIG.buy_exchange_address(token_id))();
    const config = await fetchExchangeConfig(exchange_address, provider);
    return config;

}, ["buy-exchange", "config", "token_id", token_id.toString()], {
    revalidate: 60 * 60 * 24, // 5 minutes
})

export const queryRedeemExchangeConfig = (token_id: number, provider: ethers.JsonRpcProvider) => unstable_cache(async () => {
    const exchange_address = await queryResolvePath(APP_CONFIG.redeem_exchange_address(token_id))();
    const config = await fetchExchangeConfig(exchange_address, provider);
    return config;

}, ["redeem-exchange", "config", "token_id", token_id.toString()], {
    revalidate: 60 * 60 * 24, // 5 minutes
})


const fetchExchangeConfig = async (exchange_address: string, provider: ethers.JsonRpcProvider) => {
    const contract = await getExchangeContract(exchange_address, provider);
    const config = await contract.config();
    return {
        contract_address: exchange_address,
        end_time: config.end_time.toString(),
        start_time: config.start_time.toString(),
        recipient: config.recipient,
        from_asset: config.from_asset,
        to_asset: config.to_asset,

        amount: Number(formatUnits(config.amount, "ether")),
        exchange_rate_bps: Number(config.exchange_rate_bps.toString()),
        exchanged_amount: Number(formatUnits(config.exchanged_amount, "ether")),
    }

}