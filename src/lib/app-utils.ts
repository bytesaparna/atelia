import { APP_CONFIG } from "@/config/app-config";
import { getAuctionContract, getExchangeContract, getTokensContract } from "./evm-helper";
import { IExchangeContract } from "../contract-types/ExchangeContract";
import { IAuctionContract } from "../contract-types/AuctionContract";
import { ethers, formatUnits } from "ethers";


interface TokenUri {
    name: string;
    image: string;
    attributes: TokenAttribute[];
}
interface TokenAttribute {
    trait_type: string;
    value: string;
}

export const fechTokenUri = async (uri: string) => {
    if (typeof window === "undefined") {
        const tokenUri = await import(`/public/tokens${uri}.json`);
        return tokenUri as TokenUri;
    } else {
        const tokenUri = await fetch(`/tokens${uri}.json`);
        return await tokenUri.json() as TokenUri;
    }
}

export interface NftCollection {
    title: string;
    link: string;
    thumbnail: string;
    price: number;
    creator: string;
}

export const convertTokenUriToNftCollection = (tokenUri: TokenUri) => {
    return {
        title: tokenUri.name,
        link: tokenUri.image,
        thumbnail: tokenUri.image,
        creator: tokenUri.attributes.find(attribute => attribute.trait_type === "creator")?.value || process.env.NEXT_PUBLIC_OWNER_ADDRESS,
    }
}

export const getNftCollections = async () => {
    const collections: NftCollection[] = []
    for (const config of APP_CONFIG) {
        const contract = await getTokensContract(config.tokens_address);
        // Each token has same token id in all the setups
        const tokenUri = await contract.tokenURI(0);
        const tokenUriData = await fechTokenUri(tokenUri);
        const nftCollection = convertTokenUriToNftCollection(tokenUriData);
        const appStatus = await getAppStatus(config.name);
        collections.push({
            ...nftCollection,
            price: appStatus.state === CollectionState.BUY ? appStatus.share_buy_price : appStatus.state === CollectionState.AUCTION ? appStatus.latest_auction_price : appStatus.share_redeem_price,
        })
    }
    return collections
}

export enum CollectionState {
    BUY = 'buy',
    AUCTION = 'auction',
    REDEEM = 'redeem',
}

interface AppState {
    exchange: IExchangeContract.ConfigResponseStructOutput;
    auction: IAuctionContract.TokenAuctionStateStructOutput;
    state: CollectionState;
    share_buy_price: number;
    share_redeem_price: number;
    latest_auction_price: number;
}

export const getCurrentTimeInMilliseconds = () => {
    return Math.floor(Date.now() / 1000);
}


const APP_STATUS_CACHE = new Map<string, AppState>();

export const getAppStatus = async (name: string) => {
    const app = APP_CONFIG.find(app => app.name === name);
    if (!app) {
        throw new Error(`App ${name} not found`);
    }
    if (APP_STATUS_CACHE.has(name)) {
        return APP_STATUS_CACHE.get(name)!;
    }
    const exchangeContract = await getExchangeContract(app.buy_exchange_address);
    const exchangeConfig = await exchangeContract.config();
    const auctionContract = await getAuctionContract(app.auction_address);
    const auctionStatus = await auctionContract.latest_auction_state(0);

    const currentTimeInMilliseconds = getCurrentTimeInMilliseconds();

    const state: AppState = {
        exchange: exchangeConfig,
        auction: auctionStatus,
        state: exchangeConfig[6] < currentTimeInMilliseconds ? CollectionState.BUY : auctionStatus[7] < currentTimeInMilliseconds ? CollectionState.AUCTION : CollectionState.REDEEM,
        share_buy_price: Number(exchangeConfig[2]) / 10000,
        share_redeem_price: Number(exchangeConfig[2]) / 10000,
        latest_auction_price: Number(formatUnits(auctionStatus[1], 'ether')),
    }
    APP_STATUS_CACHE.set(name, state);
    return state;

}
