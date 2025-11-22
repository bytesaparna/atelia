import { AppContract__factory, AuctionContract__factory, Cw20Contract__factory, Cw721Contract__factory, ExchangeContract__factory, KernelContract__factory, SplitterContract__factory } from "@/src/contract-types";

export const cw721Interface = Cw721Contract__factory.createInterface();
export const cw20Interface = Cw20Contract__factory.createInterface();
export const kernelInterface = KernelContract__factory.createInterface();
export const exchangeInterface = ExchangeContract__factory.createInterface();
export const auctionInterface = AuctionContract__factory.createInterface();
export const appInterface = AppContract__factory.createInterface();
export const splitterInterface = SplitterContract__factory.createInterface();


export const BATCH_MESSAGE_TYPE = {
    EXECUTE_ADO: 0,
    INSTANTIATE_ADO: 1,
} as const;


export const SHARES_SUPPLY = BigInt("5000000000000000000000");
export const BUY_EXCHANGE_RATE_BPS = BigInt("50000000"); // 1 ETH = 5000 ATELIA
export const REDEEM_EXCHANGE_RATE_BPS = BigInt("10000") / BigInt("5000"); // 1 ATELIA = 1/5000 ETH
export const MIN_BID = (SHARES_SUPPLY * REDEEM_EXCHANGE_RATE_BPS) / BigInt("10000");
export const NATIVE = "stt";
export const BUY_NOW_PRICE = BigInt(Number(MIN_BID) * 10);
export const MIN_RAISE = BigInt(5 * 10 ** 16)