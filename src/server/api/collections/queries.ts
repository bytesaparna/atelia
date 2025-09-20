import { APP_CONFIG } from "@/src/config/app-config";
import { getCurrentTimeInMilliseconds, getTokensContract } from "@/src/lib/evm-helper";
import { ITokenState, NftCollection, TokenState, TokenUri } from "@/src/types/collections";
import { ethers, formatUnits } from "ethers";
import { unstable_cache } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { queryBuyExchangeConfig, queryRedeemExchangeConfig } from "../exchange/queries";
import { queryLatestAuctionState } from "../auction/queries";

export const queryAllTokens = unstable_cache(async (provider: ethers.JsonRpcProvider) => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const contract = await getTokensContract(tokens_address, provider);
    const num_tokens = await contract.totalSupply();
    const items = new Array(Number(num_tokens)).fill(0).map(async (_, i) => {
        const token = await contract.tokenByIndex(i);
        return Number(token);
    });
    const tokens = await Promise.all(items);
    return tokens;
})

export const queryNftCollections = unstable_cache(async (provider: ethers.JsonRpcProvider) => {
    const tokens = await queryAllTokens(provider);
    const collections = await Promise.all(tokens.map(async (token_id) => {
        const nftCollection = await queryNftCollection(token_id, provider)();
        return nftCollection satisfies NftCollection;
    }));
    return collections
}, ["collections"], {
    revalidate: 60 * 5, // 5 minutes
})

export const queryNftCollection = (token_id: number, provider: ethers.JsonRpcProvider) => unstable_cache(async () => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const contract = await getTokensContract(tokens_address, provider);
    const tokenUri = await contract.tokenURI(token_id);
    const tokenUriData = await fechTokenUri(tokenUri);
    const nftCollection = convertTokenUriToNftCollection(tokenUriData);
    const appStatus = await queryTokenState(token_id, provider)();
    return {
        contract_address: tokens_address,
        id: token_id,
        ...nftCollection,
        price: appStatus.current_price,
        appStatus: appStatus,
    } satisfies NftCollection;
}, ["collection", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})

export const convertTokenUriToNftCollection = (tokenUri: TokenUri) => {
    return {
        title: tokenUri.name,
        description: tokenUri.description,
        link: tokenUri.image,
        thumbnail: tokenUri.image,
        image: tokenUri.image,
        creator: tokenUri.attributes.find(attribute => attribute.trait_type === "designer")?.value || "atelia",
        likes: Number(tokenUri.attributes.find(attribute => attribute.trait_type === "likes")?.value) || (30 + Math.floor(Math.random() * 100)),
        views: Number(tokenUri.attributes.find(attribute => attribute.trait_type === "views")?.value) || (60 + Math.floor(Math.random() * 100)),
        category: tokenUri.attributes.find(attribute => attribute.trait_type === "category")?.value || "dress",
        verified: tokenUri.attributes.find(attribute => attribute.trait_type === "verified")?.value === "true",

        attributes: tokenUri.attributes,
    }
}


export const queryTokenState = (token_id: number, provider: ethers.JsonRpcProvider) => unstable_cache(async () => {
    const exchangeConfig = await queryBuyExchangeConfig(token_id, provider)();
    const redeemExchangeConfig = await queryRedeemExchangeConfig(token_id, provider)();
    const auctionStatus = await queryLatestAuctionState(token_id, provider)();

    const currentTimeInMilliseconds = getCurrentTimeInMilliseconds();

    const min_bid_price = Number(formatUnits(BigInt(auctionStatus.min_bid), 'ether'));
    const min_raise_price = Number(formatUnits(BigInt(auctionStatus.min_raise), 'ether'));
    let latest_auction_price = Number(formatUnits(BigInt(auctionStatus.high_bidder_amount), 'ether'));
    latest_auction_price = Math.max(latest_auction_price, min_bid_price);
    const share_buy_price = Number(exchangeConfig.exchange_rate_bps) / 10000;
    const share_redeem_price = Number(redeemExchangeConfig.exchange_rate_bps) / 10000;

    const total_shares = Number(formatUnits(BigInt(exchangeConfig.amount), 'ether')) + Number(formatUnits(BigInt(exchangeConfig.exchanged_amount), 'ether'));

    const price_based_on_buy = share_buy_price * total_shares;
    const price_based_on_redeem = share_redeem_price * total_shares;

    const token_state: TokenState = Number(exchangeConfig.end_time) > currentTimeInMilliseconds ? TokenState.BUY : Number(auctionStatus.end_time) > currentTimeInMilliseconds ? TokenState.AUCTION : TokenState.REDEEM;
    const current_price = token_state === TokenState.AUCTION ? latest_auction_price : token_state === TokenState.BUY ? price_based_on_buy : price_based_on_redeem;

    const state: ITokenState = {
        state: token_state,
        auction_address: auctionStatus.auction_address,
        buy_exchange_address: exchangeConfig.contract_address,
        redeem_exchange_address: redeemExchangeConfig.contract_address,
        share_buy_price: share_buy_price,
        share_redeem_price: share_redeem_price,
        latest_auction_price: latest_auction_price,
        current_price: current_price,
        price_based_on_buy: price_based_on_buy,
        price_based_on_redeem: price_based_on_redeem,
        min_bid_price: min_bid_price,
        min_raise_price: min_raise_price,
        buy_end_time: Number(exchangeConfig.end_time),
        auction_start_time: Number(auctionStatus.start_time),
        auction_end_time: Number(auctionStatus.end_time),
        redeem_start_time: Number(exchangeConfig.start_time),
    }
    return state;
}, ["token", "state", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})



export const fechTokenUri = unstable_cache(async (uri: string) => {
    if (typeof window === "undefined") {
        const tokenUri = await import(`/public/tokens${uri}.json`);
        return tokenUri as TokenUri;
    } else {
        const tokenUri = await fetch(`/tokens${uri}.json`);
        return await tokenUri.json() as TokenUri;
    }
}, ["uri"], {
    revalidate: 60 * 60 * 24, // 24 hours
})